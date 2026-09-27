"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, Grid3X3, List, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProducts } from "@/actions/products";
import type { Product } from "@/db/schema";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Footwear",
  "Sports",
  "Home & Kitchen",
];

interface ProductGridProps {
  initialProducts: Product[];
  initialSearch?: string;
  initialCategory?: string;
}

export function ProductGrid({
  initialProducts,
  initialSearch,
  initialCategory,
}: ProductGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sort, setSort] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search") ?? initialSearch ?? "";
  const category = searchParams.get("category") ?? initialCategory ?? "";

  const loadProducts = useCallback(
    (currentSearch: string, currentCategory: string, currentSort: string, currentPriceRange: [number, number]) => {
      startTransition(async () => {
        const result = await getProducts({
          search: currentSearch || undefined,
          category: currentCategory || undefined,
          sort: currentSort as "price_asc" | "price_desc" | "newest" | "name_asc",
          minPrice: currentPriceRange[0] > 0 ? currentPriceRange[0] : undefined,
          maxPrice: currentPriceRange[1] < 1000 ? currentPriceRange[1] : undefined,
        });
        setProducts(result);
      });
    },
    [],
  );

  useEffect(() => {
    loadProducts(search, category, sort, priceRange);
  }, [search, category, sort, priceRange, loadProducts]);

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSort("newest");
    router.push("/");
  };

  const hasActiveFilters =
    search || category || sort !== "newest" || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div className="flex gap-6">
      {/* Sidebar Filters */}
      <aside
        className={`${showFilters ? "block" : "hidden"} md:block w-64 flex-shrink-0`}
      >
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Categories
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => router.push("/")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !category
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    router.push(`/?category=${encodeURIComponent(cat)}`)
                  }
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    category === cat
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              Price Range
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}{priceRange[1] >= 1000 ? "+" : ""}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Min</label>
                  <input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Max</label>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <span className="text-sm text-slate-500">
              {isPending ? (
                "Loading..."
              ) : (
                <span>
                  <span className="font-semibold text-slate-900">
                    {products.length}
                  </span>{" "}
                  {products.length === 1 ? "product" : "products"}
                  {search && (
                    <span>
                      {" "}
                      for &ldquo;<span className="text-indigo-600">{search}</span>&rdquo;
                    </span>
                  )}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Active filters */}
            {category && (
              <Badge variant="info" className="gap-1">
                {category}
                <button
                  onClick={() => router.push("/")}
                  className="ml-1 hover:text-indigo-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="name_asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg p-0.5">
              <button className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Grid3X3 className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Try adjusting your filters or search term
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
