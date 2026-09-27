import React from "react";
import { Metadata } from "next";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { getAdminStats, getAllOrders } from "@/actions/orders";
import { getProducts } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [stats, orders, products] = await Promise.all([
    getAdminStats(),
    getAllOrders(),
    getProducts(),
  ]);

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products
    .filter((p) => p.stock > 0 && p.stock <= 10)
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "indigo",
      change: "+12.5%",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "purple",
      change: "+8.2%",
    },
    {
      label: "Active Products",
      value: stats.totalActiveProducts.toString(),
      icon: Package,
      color: "emerald",
      change: "+3.1%",
    },
    {
      label: "Avg. Order Value",
      value:
        stats.totalOrders > 0
          ? formatPrice(stats.totalRevenue / stats.totalOrders)
          : "$0.00",
      icon: TrendingUp,
      color: "amber",
      change: "+4.6%",
    },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening in your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        #{String(order.id).padStart(6, "0")}
                      </span>
                      <Badge
                        variant={
                          order.status === "COMPLETED"
                            ? "success"
                            : order.status === "CANCELLED"
                              ? "destructive"
                              : "warning"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(order.createdAt)} · {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 ml-4">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-500" />
              Low Stock
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage →
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-slate-400 text-sm">All products well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                  <div className="ml-3 text-center">
                    <span className="text-sm font-bold text-amber-600">
                      {product.stock}
                    </span>
                    <p className="text-xs text-amber-500">left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
