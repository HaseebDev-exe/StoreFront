"use client";

import React, { useState, useTransition } from "react";
import {
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDate } from "@/lib/utils";
import { updateOrderStatus } from "@/actions/orders";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: number;
  quantity: number;
  price: string | number;
  productId: number;
  productName: string | null;
}

interface Order {
  id: number;
  customerName: string;
  email: string;
  shippingAddress: string;
  totalAmount: string | number;
  tax: string | number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
}

interface AdminOrdersClientProps {
  initialOrders: Order[];
}

export function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    const matchesStatus =
      statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        toast.success(`Order status updated to ${newStatus}`);
      } catch {
        toast.error("Failed to update order status");
      }
    });
  };

  const statusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "destructive";
      default:
        return "warning";
    }
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0,
  );

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm">
          {orders.length} orders · {formatPrice(totalRevenue)} total revenue
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {status}
                <span className="ml-1 opacity-70">
                  (
                  {status === "ALL"
                    ? orders.length
                    : orders.filter((o) => o.status === status).length}
                  )
                </span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 font-medium">No orders found</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      #{String(order.id).padStart(6, "0")}
                    </span>
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-medium text-slate-900">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {order.customerName}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {order.email}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </span>

                  {/* Status Change */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderStatus,
                      )
                    }
                    disabled={isPending}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id,
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Items */}
              {expandedOrder === order.id && (
                <div className="border-t border-slate-100 px-4 pb-4">
                  <div className="pt-4 space-y-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Order Items
                    </div>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.productName ?? `Product #${item.productId}`}
                          </p>
                          <p className="text-xs text-slate-400">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-400">
                        <p>Shipping: {order.shippingAddress}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-slate-500">
                          Tax: {formatPrice(order.tax)}
                        </div>
                        <div className="font-bold text-slate-900">
                          Total: {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
