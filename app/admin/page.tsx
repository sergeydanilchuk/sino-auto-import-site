export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Добро пожаловать, админ</h1>
      <p className="text-muted-foreground">
        Здесь будет сводка, статистика, графики, управление пользователями и т.д.
      </p>
    </div>
  );
}
