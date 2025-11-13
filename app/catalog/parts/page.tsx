// app/catalog/parts/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Breadcrumbs from "@/components/Breadcrumbs";
import ModalOrderParts from "./components/ModalOrderParts";

const fmt = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

type Item = {
  id: string;
  name: string;
  sku: string;
  price: string | number;
  status: "IN_STOCK" | "ON_ORDER";
  imageUrl?: string | null;
  category?: { id: string; name: string } | null;
};

type Category = { id: string; name: string };
type StatusFilter = "all" | "IN_STOCK" | "ON_ORDER";

export default function PartsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("__ALL__");
  const [status, setStatus] = useState<StatusFilter>("all");

  // модалка заказа
  const [openOrder, setOpenOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/catalog/parts", { cache: "no-store" });
        const data = await res.json();
        setItems(data.items ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories: Category[] = useMemo(() => {
    const map = new Map<string, Category>();
    for (const i of items) {
      if (i.category?.id) {
        map.set(i.category.id, {
          id: i.category.id,
          name: i.category.name,
        });
      }
    }
    return [
      { id: "__ALL__", name: "Все категории" },
      ...Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "ru")),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((i) => {
      const byText = !query
        ? true
        : [i.name, i.sku]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);

      const byCategory =
        categoryId === "__ALL__" || i.category?.id === categoryId;

      const byStatus =
        status === "all" ? true : i.status === status;

      return byText && byCategory && byStatus;
    });
  }, [items, q, categoryId, status]);

  const hasFilters =
    q.trim() || categoryId !== "__ALL__" || status !== "all";

  return (
    <>
      <ModalOrderParts
        open={openOrder}
        onOpenChangeAction={setOpenOrder}
        item={
          selectedItem
            ? {
                id: selectedItem.id,
                name: selectedItem.name,
                price: selectedItem.price,
                imageUrl: selectedItem.imageUrl,
                category: selectedItem.category,
                sku: selectedItem.sku,
              }
            : null
        }
      />

      <section className="py-16 bg-muted/50 border-t border-border">
        <Breadcrumbs />

        <div className="container mx-auto px-6 md:px-12">
          {/* Заголовок */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-left">
                Каталог запчастей
              </h1>
              <p className="text-muted-foreground text-left max-w-2xl">
                Выберите нужную запчасть, отфильтруйте по наличию и категории.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 self-start">
              {/* сюда можно добавить "Подбор по VIN" и т.п. */}
            </div>
          </div>

          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Фильтры */}
                <aside className="md:w-72 w-full border-b md:border-b-0 md:border-r border-border bg-muted/70">
                  <div className="p-5 md:p-6 space-y-6">
                    {/* Поиск */}
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Поиск
                      </Label>
                      <Input
                        type="search"
                        placeholder="Название, номер, SKU..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    {/* Категория */}
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Категория
                      </Label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Статус */}
                    <div className="space-y-2">
                      <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Наличие
                      </Label>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(e.target.value as StatusFilter)
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                      >
                        <option value="all">Все</option>
                        <option value="IN_STOCK">В наличии</option>
                        <option value="ON_ORDER">Под заказ</option>
                      </select>
                    </div>

                    {hasFilters && (
                      <div className="pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQ("");
                            setCategoryId("__ALL__");
                            setStatus("all");
                          }}
                          className="w-full text-xs"
                        >
                          Сбросить фильтры
                        </Button>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Товары */}
                <div className="flex-1 bg-muted/40">
                  <div className="p-5 md:p-8 space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                        Загрузка каталога…
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-xl bg-background">
                        <p className="text-lg font-semibold mb-1">
                          По выбранным параметрам ничего не найдено
                        </p>
                        <p className="text-muted-foreground text-sm max-w-md">
                          Попробуйте убрать часть фильтров или изменить запрос.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground">
                          Найдено: {filtered.length} из {items.length}
                        </p>

                        <ScrollArea className="h-full">
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((i) => (
                              <Card
                                key={i.id}
                                className="group border border-border bg-card hover:shadow-md transition rounded-xl overflow-hidden flex flex-col"
                              >
                                <Link href={`/catalog/parts/${i.id}`}>
                                  <div className="aspect-4/3 bg-muted overflow-hidden">
                                    {i.imageUrl && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={i.imageUrl}
                                        alt={i.name}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                      />
                                    )}
                                  </div>
                                </Link>

                                <div className="flex flex-col p-3 space-y-2 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <Link href={`/catalog/parts/${i.id}`} className="flex-1">
                                      <h2 className="text-sm font-medium leading-snug line-clamp-2">
                                        {i.name}
                                      </h2>
                                    </Link>
                                    <Badge
                                      variant={
                                        i.status === "IN_STOCK"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="whitespace-nowrap text-[10px] px-2 py-0.5"
                                    >
                                      {i.status === "IN_STOCK"
                                        ? "В наличии"
                                        : "Под заказ"}
                                    </Badge>
                                  </div>

                                  {i.category?.name && (
                                    <p className="text-[11px] text-muted-foreground">
                                      {i.category.name}
                                    </p>
                                  )}

                                  <div className="mt-auto space-y-2 pt-2 border-t border-border/70">
                                    <div className="flex items-center justify-between">
                                      <span className="text-base font-semibold">
                                        {fmt.format(Number(i.price))}
                                      </span>
                                    </div>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-xs"
                                      onClick={() => {
                                        setSelectedItem(i);
                                        setOpenOrder(true);
                                      }}
                                    >
                                      Заказать
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
