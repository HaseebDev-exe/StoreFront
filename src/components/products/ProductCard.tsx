"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/db/schema";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      stock: product.stock,
    });

    toast.success(`${product.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: openCart,
      },
    });
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-slate-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="info" className="text-xs shadow-sm">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-slate-500 text-xs mt-1 line-clamp-2 flex-1 leading-relaxed">
            {product.description}
          </p>

          {/* Rating mockup */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${star <= 4 ? "text-amber-400 fill-current" : "text-slate-200 fill-current"}`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">(4.0)</span>
          </div>

          {/* Price & CTA */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div>
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-xs text-amber-600 font-medium">
                  Only {product.stock} left!
                </p>
              )}
            </div>

            <Badge
              variant={isOutOfStock ? "secondary" : "success"}
              className="text-xs"
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </Badge>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant={isOutOfStock ? "secondary" : "primary"}
            size="sm"
            className="mt-3 w-full"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
