"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "USER",
  });

  return { success: true };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid credentials" };
  }
}

export async function logoutUser() {
  await signOut({ redirect: false });
}
