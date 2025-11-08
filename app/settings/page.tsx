import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import MeRefetcher from "@/components/MeRefetcher";
import AvatarEditorDialog from "@/components/AvatarEditorDialog";
import AvatarEditorLauncher from "@/components/AvatarEditorLauncher";

export default async function SettingsPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  return (
    <div className="container max-w-2xl py-10 space-y-8">
    <MeRefetcher />
      <h1 className="text-2xl font-semibold">Настройки профиля</h1>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Имя</h2>
        <form action={updateName}>
          <div className="flex items-center gap-3">
            <Input name="name" defaultValue={me.name ?? ""} placeholder="Ваше имя" />
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Аватар</h2>
        <AvatarEditorLauncher currentUrl={me.avatarUrl ?? null} />
      </Card>
    </div>
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
