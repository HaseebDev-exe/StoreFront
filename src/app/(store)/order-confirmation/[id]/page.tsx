import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  Mail,
  ArrowRight,
  Printer,
} from "lucide-react";
import { getOrderById } from "@/actions/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const subtotal = Number(order.totalAmount) - Number(order.tax);
  const shipping =
    subtotal > 100
      ? 0
      : Number(order.totalAmount) - subtotal - Number(order.tax);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-slate-500">
          Thank you for your purchase. We&apos;ve received your order and will
          start processing it right away.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Order Header */}
        <div className="bg-indigo-600 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-indigo-200 text-xs font-medium">Order ID</p>
            <p className="text-white font-bold text-lg">
              #{String(order.id).padStart(6, "0")}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-indigo-200 text-xs font-medium">Order Date</p>
            <p className="text-white font-semibold text-sm">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
              {order.status}
            </Badge>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Contact
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {order.customerName}
                </p>
                <p className="text-sm text-slate-600">{order.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Shipping Address
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-600" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName ?? "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {item.productName ?? "Unknown Product"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span>{formatPrice(order.tax)}</span>
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
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-1">
              <span>Total Paid</span>
              <span className="text-indigo-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        A confirmation email has been sent to{" "}
        <span className="font-medium text-slate-600">{order.email}</span>
      </p>
    </div>
  );
}
