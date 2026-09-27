"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import { toast } from "sonner";

type FormErrors = Partial<Record<string, string>>;

export function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processed = value;
    if (name === "cardNumber") {
      processed = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }
    if (name === "expiry") {
      processed = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .replace(/(.{2})(.+)/, "$1/$2");
    }
    if (name === "cvc") {
      processed = value.replace(/\D/g, "").slice(0, 3);
    }
    setForm((prev) => ({ ...prev, [name]: processed }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!form.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    if (!form.expiry.trim()) newErrors.expiry = "Expiry is required";
    if (!form.cvc.trim()) newErrors.cvc = "CVC is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customerName: form.customerName,
        email: form.email,
        shippingAddress: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (result.success) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation/${result.orderId}`);
      } else {
        toast.error(result.error ?? "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>
          <p className="text-slate-500">
            Add some products before checking out.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
          <Lock className="h-4 w-4" />
          Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="font-semibold text-slate-900">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="customerName" className="text-slate-700 mb-1.5 block">
                    Full Name *
                  </Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    placeholder="John Doe"
                    value={form.customerName}
                    onChange={handleChange}
                    className={errors.customerName ? "border-red-400" : ""}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email" className="text-slate-700 mb-1.5 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-400" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address" className="text-slate-700 mb-1.5 block">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, Apt 4B"
                    value={form.address}
                    onChange={handleChange}
                    className={errors.address ? "border-red-400" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city" className="text-slate-700 mb-1.5 block">
                    City *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={form.city}
                    onChange={handleChange}
                    className={errors.city ? "border-red-400" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zip" className="text-slate-700 mb-1.5 block">
                    ZIP Code *
                  </Label>
                  <Input
                    id="zip"
                    name="zip"
                    placeholder="10001"
                    value={form.zip}
                    onChange={handleChange}
                    className={errors.zip ? "border-red-400" : ""}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="country" className="text-slate-700 mb-1.5 block">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="font-semibold text-slate-900">
                  Payment Details
                </h2>
                <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                  <Lock className="h-3 w-3" />
                  SSL encrypted
                </div>
              </div>

              <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                This is a demo. No real payment is processed.
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-slate-700 mb-1.5 block">
                    Card Number *
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={handleChange}
                      className={errors.cardNumber ? "border-red-400 pr-12" : "pr-12"}
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-slate-700 mb-1.5 block">
                      Expiry Date *
                    </Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={handleChange}
                      className={errors.expiry ? "border-red-400" : ""}
                    />
                    {errors.expiry && (
                      <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-slate-700 mb-1.5 block">
                      CVC *
                    </Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      value={form.cvc}
                      onChange={handleChange}
                      className={errors.cvc ? "border-red-400" : ""}
                    />
                    {errors.cvc && (
                      <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-indigo-600" />
                Order Summary
                <Badge variant="secondary" className="ml-auto">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-center text-slate-400 mt-3">
                  Add ${formatPrice(100 - subtotal)} more for free shipping
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Place Order — {formatPrice(total)}
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Your information is secure
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
