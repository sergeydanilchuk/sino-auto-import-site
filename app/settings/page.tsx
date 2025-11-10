export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import MeRefetcher from "@/components/MeRefetcher";
import AvatarEditorLauncher from "@/components/avatar/AvatarEditorLauncher";

export default async function SettingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  return (
    <section className="py-16 border-t border-border/40 bg-muted/40">
      <MeRefetcher />
      <div className="container mx-auto px-12">
        <div className="w-full p-6 md:p-10 bg-muted/40 backdrop-blur-sm border border-border/50 ring-1 ring-border/30 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-left">
            Настройки профиля
          </h1>

          {/* Основной контент */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
            {/* Левая часть — аватар */}
            <div className="flex flex-col items-center md:items-start gap-4">
                <AvatarEditorLauncher currentUrl={me.avatarUrl ?? null} />
            </div>

            {/* Правая часть — имя и кнопка */}
            <Card className="flex-1 p-6 md:p-8 space-y-4 w-full">
              <h2 className="text-lg font-medium text-left">Имя пользователя</h2>
              <form action={updateName}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Input
                    name="name"
                    defaultValue={me.name ?? ""}
                    placeholder="Ваше имя"
                    className="sm:flex-1 text-base"
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Сохранить
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

async function updateName(formData: FormData) {
  "use server";
  const me = await getCurrentUser();
  if (!me) return;

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 50) return;

  await prisma.user.update({ where: { id: me.id }, data: { name } });

  const { redirect: serverRedirect } = await import("next/navigation");
  serverRedirect("/settings?refresh=1");
}

async function uploadAvatar(formData: FormData) {
  "use server";
  const me = await getCurrentUser();
  if (!me) return;

  const file = formData.get("file") as File | null;
  if (!file) return;
  if (!file.type.startsWith("image/")) return;
  if (file.size > 2_000_000) return;

  const { put, del } = await import("@vercel/blob");

  const prev = await prisma.user.findUnique({
    where: { id: me.id },
    select: { avatarUrl: true },
  });

  const key = `avatars/${me.id}/${Date.now()}`;
  const blob = await put(key, file, { access: "public" });

  await prisma.user.update({
    where: { id: me.id },
    data: { avatarUrl: blob.url },
  });

  if (prev?.avatarUrl?.includes("blob.vercel-storage.com")) {
    try { await del(prev.avatarUrl); } catch {}
  }

  const { redirect: serverRedirect } = await import("next/navigation");
  serverRedirect("/settings?refresh=1");
}
