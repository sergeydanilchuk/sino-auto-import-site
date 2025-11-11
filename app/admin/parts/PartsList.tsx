"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Item = {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  stock: number;
  status: "IN_STOCK" | "ON_ORDER";
  imageUrl?: string | null;
  category?: { id: string; name: string } | null;
};

export default function PartsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("__ALL__");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (manual = false) => {
    setLoading(true);
    try {
      const r = await fetch("/api/catalog/parts", { cache: "no-store" });
      const data = await r.json();
      setItems(data.items ?? []);
      if (manual) toast.success("Список обновлён");
    } catch {
      if (manual) toast.error("Не удалось обновить список");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const fmt = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" });

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const i of items) {
      if (i.category?.id) map.set(i.category.id, { id: i.category.id, name: i.category.name });
    }
    return [
      { id: "__ALL__", name: "Все категории" },
      ...Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "ru")),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const byText = (i: Item) => {
      if (!q.trim()) return true;
      const hay = [i.name, i.sku].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q.toLowerCase());
    };
    const byCat = (i: Item) => categoryId === "__ALL__" || i.category?.id === categoryId;
    return items.filter((i) => byText(i) && byCat(i));
  }, [items, q, categoryId]);

  // Поддерживаем основной путь (/api/catalog/parts/[id]) и дауншифт на коллекционный DELETE, если вдруг понадобится
  async function deleteItem(id: string) {
    setDeletingId(id);
    try {
      // Основной путь — сегмент [id]
      let res = await fetch(`/api/catalog/parts/${id}`, { method: "DELETE" });

      // На случай, если окружение по какой-то причине не сматчило [id] роут — пробуем коллекционный
      if (!res.ok) {
        const fallback = await fetch(`/api/catalog/parts`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (fallback.ok) {
          res = fallback;
        } else {
          const text = await fallback.text();
          throw new Error(`${fallback.status} ${text}`.trim());
        }
      }

      // Успешно — оптимистично выкидываем из локального списка
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Запчасть удалена");
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "Не удалось удалить запчасть";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading && !items.length) return <div className="text-sm text-muted-foreground">Загрузка списка…</div>;

  if (!items.length) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Запчастей пока нет.</div>
        <Button variant="outline" size="sm" onClick={() => load(true)} disabled={loading}>
          <RotateCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Обновить
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Поиск: название или номер"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(true)}
            disabled={loading}
            aria-label="Обновить список"
          >
            <RotateCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-right">Остаток</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id} className="hover:bg-accent/50">
                <TableCell>
                  {i.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/catalog/parts/${i.id}`} className="font-medium hover:underline">
                    {i.name}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                <TableCell>{i.category?.name ?? "—"}</TableCell>
                <TableCell className="text-right">{fmt.format(Number(i.price))}</TableCell>
                <TableCell className="text-right">{i.stock}</TableCell>
                <TableCell>
                  {i.status === "IN_STOCK" ? (
                    <Badge variant="default">В наличии</Badge>
                  ) : (
                    <Badge variant="secondary">Под заказ</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Удалить запчасть"
                        disabled={deletingId === i.id}
                      >
                        <Trash2 className={`h-4 w-4 ${deletingId === i.id ? "animate-pulse" : ""}`} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить «{i.name}»?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Действие необратимо. Запчасть будет удалена из каталога.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingId === i.id}>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          className="text-destructive hover:bg-destructive/10 focus:ring-destructive"
                          onClick={() => deleteItem(i.id)}
                          disabled={deletingId === i.id}
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Показано: {filtered.length} из {items.length}</span>
        {loading && <span>Обновление…</span>}
      </div>
    </div>
  );
}
