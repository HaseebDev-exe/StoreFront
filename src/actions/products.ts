"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, and, gte, lte, asc, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export type ProductFilter = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "name_asc";
};

export async function getProducts(filters: ProductFilter = {}) {
  const { search, category, minPrice, maxPrice, sort = "newest" } = filters;

  const conditions = [];

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }
  if (category && category !== "all") {
    conditions.push(eq(products.category, category));
  }
  if (minPrice !== undefined) {
    conditions.push(gte(products.price, String(minPrice)));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(products.price, String(maxPrice)));
  }

  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = asc(sql`${products.price}::numeric`);
      break;
    case "price_desc":
      orderBy = desc(sql`${products.price}::numeric`);
      break;
    case "name_asc":
      orderBy = asc(products.name);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const result = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy);

  return result;
}

export async function getProductById(id: number) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return product ?? null;
}

export async function getCategories() {
  const result = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .orderBy(asc(products.category));
  return result.map((r) => r.category);
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: number;
  imageUrl: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.insert(products).values({
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    stock: data.stock,
    imageUrl: data.imageUrl,
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(
  id: number,
  data: {
    name: string;
    description: string;
    price: string;
    category: string;
    stock: number;
    imageUrl: string;
  },
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
}
