import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/providers/CartProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "StoreFront — Premium E-Commerce",
    template: "%s | StoreFront",
  },
  description:
    "Shop the latest products at StoreFront. Premium quality, fast shipping, and exceptional service.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <SessionProvider session={session}>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "12px",
                  fontSize: "14px",
                },
              }}
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
