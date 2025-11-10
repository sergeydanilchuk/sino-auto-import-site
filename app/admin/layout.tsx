// app/admin/layout.tsx
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/app/admin/components/AdminLayoutClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <AdminLayoutClient userEmail={user.email}>
      {children}
    </AdminLayoutClient>
  );
}

