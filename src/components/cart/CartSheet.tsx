"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Plus, Minus, Trash2, Package } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;
  const totalItems = getTotalItems();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Shopping Cart
            </h2>
            {totalItems > 0 && (
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-600 font-medium">Your cart is empty</p>
                <p className="text-slate-400 text-sm mt-1">
                  Add some products to get started
                </p>
              </div>
              <Button variant="primary" onClick={closeCart} size="sm">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200">
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
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-sm font-semibold text-indigo-600 mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-6 w-6 rounded-md flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="h-6 w-6 rounded-md flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 rounded-md flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4 space-y-4">
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
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-center text-slate-500">
                Free shipping on orders over $100
              </p>
            )}

            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full text-slate-600"
              onClick={closeCart}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
