import React from "react";
import { Metadata } from "next";
import { getProducts } from "@/actions/products";
import { AdminProductsClient } from "./AdminProductsClient";

export const metadata: Metadata = { title: "Manage Products" };

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <AdminProductsClient initialProducts={products} />;
}
