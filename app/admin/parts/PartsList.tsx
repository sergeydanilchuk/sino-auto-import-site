// app/admin/parts/PartsList.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  Trash2,
  ChevronsUpDown,
  Check,
  X,
  Pencil
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";

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

type Cat = { id: string; name: string };

const ALL_CAT = "__ALL__";

/* --------- Модалка редактирования одной запчасти --------- */

type EditPartDialogProps = {
  part: Item;
  cats: Cat[];
  onUpdated: (updated: Item) => void;
};

function EditPartDialog({ part, cats, onUpdated }: EditPartDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState(part.name);
  const [sku, setSku] = useState(part.sku);
  const [price, setPrice] = useState(String(part.price));
  const [stock, setStock] = useState(String(part.stock));
  const [status, setStatus] = useState<Item["status"]>(part.status);
  const [categoryId, setCategoryId] = useState<string>(part.category?.id ?? "");

  // При открытии / смене товара — сбрасываем форму к актуальным данным
  useEffect(() => {
    if (!open) return;
    setName(part.name);
    setSku(part.sku);
    setPrice(String(part.price));
    setStock(String(part.stock));
    setStatus(part.status);
    setCategoryId(part.category?.id ?? "");
    setErr(null);
  }, [open, part]);

  const canSubmit =
    !!name.trim() && !!price.trim() && !!stock.trim() && !saving;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setErr(null);

    try {
      const payload: any = {
        name: name.trim(),
        sku: sku.trim(),
        price: Number(price),
        stock: Number(stock),
        status,
        // пустая строка => без категории
        categoryId: categoryId || null
      };

      const res = await fetch(`/api/catalog/parts/${part.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Не удалось сохранить изменения");
      }

      const updated: Item = {
        ...part,
        ...payload,
        category: categoryId
          ? cats.find((c) => c.id === categoryId) || null
          : null
      };

      onUpdated(updated);
      toast.success("Изменения сохранены");
      setOpen(false);
    } catch (e: any) {
      setErr(e?.message || "Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="mr-1"
          aria-label="Редактировать запчасть"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Изменить запчасть</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Название *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label>SKU / номер детали</Label>
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Можно оставить пустым"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Категория</Label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                <option value="">Без категории</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label>Статус *</Label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "IN_STOCK" | "ON_ORDER")
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                <option value="IN_STOCK">В наличии</option>
                <option value="ON_ORDER">Под заказ</option>
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label>Цена *</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Остаток *</Label>
              <Input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              {saving ? "Сохраняю…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------- Список запчастей --------------------- */

export default function PartsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [categoryId, setCategoryId] = useState<string>(ALL_CAT);
  const [cats, setCats] = useState<Cat[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catPopoverOpen, setCatPopoverOpen] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(
    async (manual = false) => {
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
    },
    []
  );

  const loadCats = useCallback(async () => {
    try {
      setCatsLoading(true);
      const res = await fetch("/api/catalog/parts/categories");
      const data = await res.json();
      setCats(data.items ?? []);
    } catch {
      toast.error("Не удалось загрузить категории");
    } finally {
      setCatsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    loadCats();
  }, [load, loadCats]);

  const fmt = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB"
  });

  const filtered = useMemo(() => {
    const byText = (i: Item) => {
      if (!q.trim()) return true;
      const hay = [i.name, i.sku].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q.toLowerCase());
    };
    const byCat = (i: Item) =>
      categoryId === ALL_CAT || i.category?.id === categoryId;

    return items.filter((i) => byText(i) && byCat(i));
  }, [items, q, categoryId]);

  async function deleteItem(id: string) {
    setDeletingId(id);
    try {
      let res = await fetch(`/api/catalog/parts/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const fallback = await fetch(`/api/catalog/parts`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        if (fallback.ok) {
          res = fallback;
        } else {
          const text = await fallback.text();
          throw new Error(`${fallback.status} ${text}`.trim());
        }
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      toast.success("Запчасть удалена");
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "Не удалось удалить запчасть";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  function getSelectedCatName() {
    if (categoryId === ALL_CAT) return "Все категории";
    const found = cats.find((c) => c.id === categoryId);
    return found?.name ?? "Все категории";
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (
      !window.confirm(
        `Удалить категорию «${name}»?\nВсе запчасти из неё станут «без категории».`
      )
    ) {
      return;
    }

    try {
      setDeletingCatId(id);

      // ✅ так же, как в AddPartDialog — передаём id через query-параметр
      const res = await fetch(
        `/api/catalog/parts/categories?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error(await res.text());

      toast.success(`Категория «${name}» удалена.`);

      // убрать категорию из локального списка
      setCats((prev) => prev.filter((c) => c.id !== id));

      // обновить запчасти (их categoryId станет null)
      await load(true);

      // если фильтр стоял на удалённой категории — сбросить
      if (categoryId === id) {
        setCategoryId(ALL_CAT);
      }
    } catch {
      toast.error("Не удалось удалить категорию");
    } finally {
      setDeletingCatId(null);
    }
  }

  if (loading && !items.length)
    return (
      <div className="text-sm text-muted-foreground">Загрузка списка…</div>
    );

  if (!items.length) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Запчастей пока нет.</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => load(true)}
          disabled={loading}
        >
          <RotateCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
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

        {/* Фильтр по категории — combobox с поиском, удалением и сбросом */}
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Popover open={catPopoverOpen} onOpenChange={setCatPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={catsLoading}
              >
                {catsLoading ? "Загрузка…" : getSelectedCatName()}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0">
              <Command>
                <CommandInput placeholder="Найти категорию..." />
                <CommandList>
                  <CommandEmpty>Ничего не найдено</CommandEmpty>

                  <CommandGroup heading="Фильтр">
                    <CommandItem
                      value="Все категории"
                      onSelect={() => {
                        setCategoryId(ALL_CAT);
                        setCatPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={
                          "mr-2 h-4 w-4 " +
                          (categoryId === ALL_CAT
                            ? "opacity-100"
                            : "opacity-0")
                        }
                      />
                      Все категории
                    </CommandItem>
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Категории">
                    {cats.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.name}
                        onSelect={() => {
                          setCategoryId(c.id);
                          setCatPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={
                            "mr-2 h-4 w-4 " +
                            (categoryId === c.id
                              ? "opacity-100"
                              : "opacity-0")
                          }
                        />
                        <span className="flex-1">{c.name}</span>
                        <button
                          type="button"
                          className="ml-2 inline-flex items-center text-xs text-red-500 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!deletingCatId) {
                              void handleDeleteCategory(c.id, c.name);
                            }
                          }}
                        >
                          <Trash2
                            className={
                              "h-4 w-4 " +
                              (deletingCatId === c.id ? "animate-pulse" : "")
                            }
                          />
                        </button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Сброс выбранной категории */}
          {categoryId !== ALL_CAT && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCategoryId(ALL_CAT)}
              className="shrink-0"
              aria-label="Сбросить фильтр по категории"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(true)}
            disabled={loading}
            aria-label="Обновить список"
          >
            <RotateCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
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
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id} className="hover:bg-accent/50">
                <TableCell>
                  {i.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/catalog/parts/${i.id}`}
                    className="font-medium hover:underline"
                  >
                    {i.name}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                <TableCell>{i.category?.name ?? "—"}</TableCell>
                <TableCell className="text-right">
                  {fmt.format(Number(i.price))}
                </TableCell>
                <TableCell className="text-right">{i.stock}</TableCell>
                <TableCell>
                  {i.status === "IN_STOCK" ? (
                    <Badge variant="default">В наличии</Badge>
                  ) : (
                    <Badge variant="secondary">Под заказ</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* Кнопка редактирования */}
                    <EditPartDialog
                      part={i}
                      cats={cats}
                      onUpdated={(updated) =>
                        setItems((prev) =>
                          prev.map((p) => (p.id === updated.id ? updated : p))
                        )
                      }
                    />

                    {/* Кнопка удаления */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="default"
                          size="icon"
                          aria-label="Удалить запчасть"
                          disabled={deletingId === i.id}
                        >
                          <Trash2
                            className={`h-4 w-4 ${
                              deletingId === i.id ? "animate-pulse" : ""
                            }`}
                          />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Удалить «{i.name}»?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Действие необратимо. Запчасть будет удалена из
                            каталога.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            disabled={deletingId === i.id}
                          >
                            Отмена
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteItem(i.id)}
                            disabled={deletingId === i.id}
                            className="bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Показано: {filtered.length} из {items.length}
        </span>
        {loading && <span>Обновление…</span>}
      </div>
    </div>
  );
}
