import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader session={session} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
