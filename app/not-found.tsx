"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const r = useRouter();

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <Card className="w-full max-w-xl p-8 text-center space-y-4">
        <div className="text-6xl font-extrabold tracking-tight">404</div>
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="text-muted-foreground">
          Возможно, ссылка устарела или страница была перемещена.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => r.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
