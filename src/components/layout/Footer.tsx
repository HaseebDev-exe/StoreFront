import React from "react";
import Link from "next/link";
import { Store, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Store<span className="text-indigo-400">Front</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your one-stop shop for premium products. Quality guaranteed, fast
              shipping, and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              {["Electronics", "Clothing", "Accessories", "Footwear", "Sports", "Home & Kitchen"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/?category=${encodeURIComponent(cat)}`}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} StoreFront. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-400 fill-current" /> by StoreFront Team
          </p>
        </div>
      </div>
    </footer>
  );
}
