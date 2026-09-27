import React, { Suspense } from "react";
import { getProducts, getCategories } from "@/actions/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

async function ProductsSection({
  search,
  category,
}: {
  search?: string;
  category?: string;
}) {
  const products = await getProducts({ search, category });
  return (
    <ProductGrid
      initialProducts={products}
      initialSearch={search}
      initialCategory={category}
    />
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;
  const categories = await getCategories();
  const showHero = !search && !category;

  return (
    <div>
      {/* Hero Section */}
      {showHero && (
        <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full mb-6 border border-white/20">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                New arrivals every week
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Shop the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                  Latest
                </span>{" "}
                Trends
              </h1>
              <p className="text-lg text-indigo-100 mb-8 max-w-md leading-relaxed">
                Discover premium products across electronics, fashion,
                accessories and more. Quality guaranteed with fast shipping.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="#products">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/?category=Electronics">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    View Electronics
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Features Row */}
          <div className="relative border-t border-white/10 bg-black/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Truck,
                    text: "Free Shipping",
                    sub: "On orders over $100",
                  },
                  {
                    icon: Shield,
                    text: "Secure Payment",
                    sub: "100% protected",
                  },
                  {
                    icon: Star,
                    text: "Top Quality",
                    sub: "Curated products",
                  },
                ].map(({ icon: Icon, text, sub }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{text}</p>
                      <p className="text-xs text-indigo-200">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills (when browsing) */}
      {(search || category) && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600">
                {search
                  ? `Results for "${search}"`
                  : `Category: ${category}`}
              </span>
              <Link
                href="/"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
              >
                Clear
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {showHero && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Discover our curated collection of premium items
            </p>
          </div>
        )}

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ProductsSection search={search} category={category} />
        </Suspense>
      </section>
    </div>
  );
}
