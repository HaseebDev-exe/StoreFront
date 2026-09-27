import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package, Star, Truck, Shield } from "lucide-react";
import { getProductById, getProducts } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ProductCard } from "@/components/products/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  const related = await getProducts({ category: product.category });
  const relatedProducts = related
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-medium line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-24 w-24 text-slate-300" />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Badge variant="info" className="w-fit mb-3">
            {product.category}
          </Badge>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4
                      ? "text-amber-400 fill-current"
                      : "text-slate-200 fill-current"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">(4.0 / 128 reviews)</span>
          </div>

          {/* Price */}
          <div className="mt-6 pb-6 border-b border-slate-100">
            <span className="text-4xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6 pb-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="mt-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Badge
                variant={isOutOfStock ? "secondary" : "success"}
                className="text-sm"
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </Badge>
              {!isOutOfStock && (
                <span className="text-sm text-slate-500">
                  {product.stock <= 10 ? (
                    <span className="text-amber-600 font-medium">
                      Only {product.stock} left!
                    </span>
                  ) : (
                    `${product.stock} units available`
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                sub: "On orders over $100",
              },
              {
                icon: Shield,
                title: "Secure Checkout",
                sub: "SSL encrypted",
              },
            ].map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    {title}
                  </p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
