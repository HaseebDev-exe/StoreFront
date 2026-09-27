import React from "react";
import { Metadata } from "next";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import { getAdminStats, getAllOrders } from "@/actions/orders";
import { getProducts } from "@/actions/products";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const [stats, orders, products] = await Promise.all([
    getAdminStats(),
    getAllOrders(),
    getProducts(),
  ]);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  for (const product of products) {
    categoryMap[product.category] = (categoryMap[product.category] ?? 0) + 1;
  }
  const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Revenue by status
  const pendingRevenue = orders
    .filter((o) => o.status === "PENDING")
    .reduce((s, o) => s + Number(o.totalAmount), 0);
  const completedRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((s, o) => s + Number(o.totalAmount), 0);

  const topProducts = products
    .filter((p) => p.stock > 0)
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm">
          Overview of your store performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {[
          {
            label: "Total Revenue",
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            bg: "bg-indigo-50",
            icon_color: "text-indigo-600",
          },
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            bg: "bg-purple-50",
            icon_color: "text-purple-600",
          },
          {
            label: "Active Products",
            value: stats.totalActiveProducts,
            icon: Package,
            bg: "bg-emerald-50",
            icon_color: "text-emerald-600",
          },
          {
            label: "Avg. Order Value",
            value:
              stats.totalOrders > 0
                ? formatPrice(stats.totalRevenue / stats.totalOrders)
                : "$0.00",
            icon: TrendingUp,
            bg: "bg-amber-50",
            icon_color: "text-amber-600",
          },
          {
            label: "Pending Revenue",
            value: formatPrice(pendingRevenue),
            icon: BarChart3,
            bg: "bg-orange-50",
            icon_color: "text-orange-600",
          },
          {
            label: "Completed Revenue",
            value: formatPrice(completedRevenue),
            icon: Users,
            bg: "bg-teal-50",
            icon_color: "text-teal-600",
          },
        ].map(({ label, value, icon: Icon, bg, icon_color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div
              className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}
            >
              <Icon className={`h-5 w-5 ${icon_color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Package className="h-4 w-4 text-indigo-600" />
            Products by Category
          </h2>
          <div className="space-y-3">
            {categoryData.map(([category, count]) => {
              const pct = Math.round((count / products.length) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">
                      {category}
                    </span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products by Price */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Premium Products
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">
                      {product.name}
                    </p>
                    <Badge variant="info" className="text-xs mt-0.5">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 ml-3">
                  {formatPrice(product.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 xl:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-indigo-600" />
            Recent Order History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase">
                    Order
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase">
                    Customer
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-xs font-mono text-slate-400">
                      #{String(order.id).padStart(6, "0")}
                    </td>
                    <td className="py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-400">{order.email}</p>
                    </td>
                    <td className="py-3 text-xs text-slate-500 hidden sm:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3">
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
                    </td>
                    <td className="py-3 text-right text-sm font-bold text-slate-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
