"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Store,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Footwear",
  "Sports",
  "Home & Kitchen",
];

export function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const { getTotalItems, toggleCart } = useCartStore();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
    setMobileOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === "All") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(cat)}`);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Store<span className="text-indigo-600">Front</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-4 h-10 bg-slate-50 border-slate-200"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-slate-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-1">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {session.user?.email}
                        </p>
                        {session.user?.role === "ADMIN" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                            Admin
                          </span>
                        )}
                      </div>
                      {session.user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="hidden md:block">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-slate-700" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar - Desktop */}
      <div className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1 text-sm font-medium text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="primary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Auth */}
          {session ? (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-slate-500">{session.user?.email}</p>
                </div>
              </div>
              {session.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 w-full px-2 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
