"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  const r = useRouter();

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-xl p-8 text-center space-y-4">
        <div className="text-6xl font-extrabold tracking-tight">404</div>
        <h1 className="text-2xl font-semibold">Раздел админки не найден</h1>
        <p className="text-muted-foreground">
          Проверьте путь или вернитесь к разделам админ-панели.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => r.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <Button asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              В админку
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
