import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
