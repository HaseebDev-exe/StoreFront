"use server";

import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc, sum, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CheckoutItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CheckoutData {
  customerName: string;
  email: string;
  shippingAddress: string;
  items: CheckoutItem[];
}

export async function createOrder(data: CheckoutData) {
  const { customerName, email, shippingAddress, items } = data;

  if (!items || items.length === 0) {
    return { success: false, error: "No items in cart" };
  }

  // Validate stock for all items
  for (const item of items) {
    const [product] = await db
      .select({ stock: products.stock, name: products.name })
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);

    if (!product) {
      return {
        success: false,
        error: `Product #${item.productId} not found`,
      };
    }

    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}". Only ${product.stock} left.`,
      };
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const totalAmount = subtotal + tax + shipping;

  // Create order in a transaction-like approach
  const [newOrder] = await db
    .insert(orders)
    .values({
      customerName,
      email,
      shippingAddress,
      totalAmount: totalAmount.toFixed(2),
      tax: tax.toFixed(2),
      status: "PENDING",
    })
    .returning();

  // Insert order items and deduct stock
  for (const item of items) {
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price.toFixed(2),
    });

    // Deduct stock
    await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${item.quantity}` })
      .where(eq(products.id, item.productId));
  }

  revalidatePath("/admin/orders");
  revalidatePath("/");

  return { success: true, orderId: newOrder.id };
}

export async function getOrderById(id: number) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productId: orderItems.productId,
      productName: products.name,
      productImage: products.imageUrl,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function getAllOrders() {
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    allOrders.map(async (order) => {
      const items = await db
        .select({
          id: orderItems.id,
          quantity: orderItems.quantity,
          price: orderItems.price,
          productId: orderItems.productId,
          productName: products.name,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      return { ...order, items };
    }),
  );

  return ordersWithItems;
}

export async function getAdminStats() {
  const [revenueResult] = await db
    .select({ total: sum(orders.totalAmount) })
    .from(orders);

  const [ordersResult] = await db.select({ total: count() }).from(orders);

  const [productsResult] = await db
    .select({ total: count() })
    .from(products)
    .where(sql`${products.stock} > 0`);

  return {
    totalRevenue: Number(revenueResult?.total ?? 0),
    totalOrders: Number(ordersResult?.total ?? 0),
    totalActiveProducts: Number(productsResult?.total ?? 0),
  };
}

export async function updateOrderStatus(
  id: number,
  status: "PENDING" | "COMPLETED" | "CANCELLED",
) {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
}
