"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Settings, Menu, Store } from "lucide-react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  session: Session;
}

const BREADCRUMBS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/analytics": "Analytics",
};

export function AdminHeader({ session }: AdminHeaderProps) {
  const pathname = usePathname();
  const current = BREADCRUMBS[pathname] ?? "Admin";

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm h-14 flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Mobile Store Logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Store className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 text-sm">StoreFront Admin</span>
      </div>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
        <Link href="/admin" className="hover:text-indigo-600 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900">{current}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-600 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {session.user?.name?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900">
              {session.user?.name}
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
        </Button>
      </div>
    </header>
  );
}
