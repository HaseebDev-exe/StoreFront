import React from "react";
import { Metadata } from "next";
import { getAllOrders } from "@/actions/orders";
import { AdminOrdersClient } from "./AdminOrdersClient";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}
