"use client";

import { useEffect, useState } from "react";
import { CartSheet } from "@/components/cart/CartSheet";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && <CartSheet />}
    </>
  );
}
