"use client";

import React, { useState } from "react";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/db/schema";
import Link from "next/link";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        stock: product.stock,
      });
    }
    toast.success(
      `${quantity}x ${product.name} added to cart!`,
      {
        action: {
          label: "View Cart",
          onClick: openCart,
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Quantity</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-slate-50 transition-colors"
              >
                <Minus className="h-4 w-4 text-slate-600" />
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-slate-900 min-w-[3rem] text-center border-x border-slate-200">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
                className="px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            <span className="text-sm text-slate-500">
              × {formatPrice(product.price)} each
            </span>
          </div>
        </div>
      )}

      {/* Total Price Display */}
      {!isOutOfStock && quantity > 1 && (
        <p className="text-sm text-slate-600">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {formatPrice(Number(product.price) * quantity)}
          </span>
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        {!isOutOfStock && (
          <Link href="/checkout" onClick={handleAddToCart} className="flex-1">
            <Button size="lg" variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
