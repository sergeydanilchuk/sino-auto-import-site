"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel,
} from "@/components/ui/select";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

const NONE_CAT = "__NONE__";
const NEW_CAT = "__NEW__";

type Cat = { id: string; name: string };

export default function AddPartDialog() {
  const r = useRouter();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [cats, setCats] = useState<Cat[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string>(NONE_CAT);
  const [newCatName, setNewCatName] = useState("");

  const [status, setStatus] = useState<"IN_STOCK" | "ON_ORDER">("IN_STOCK");

  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setCatsLoading(true);
        const res = await fetch("/api/catalog/parts/categories");
        const { items } = await res.json();
        setCats(items ?? []);
      } catch {
        // ignore
      } finally {
        setCatsLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  function pickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setErr(null);
    if (!f) {
      clearFile();
      return;
    }
    if (filePreview) URL.revokeObjectURL(filePreview);
    const url = URL.createObjectURL(f);
    setFile(f);
    setFilePreview(url);
  }

  function clearFile() {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const canSubmit = useMemo(() => {
    if (saving) return false;
    if (!name.trim()) return false;
    if (!price.trim()) return false;
    if (!stock.trim()) return false;
    if (selectedCat === NEW_CAT && !newCatName.trim()) return false;
    return true;
  }, [saving, name, price, stock, selectedCat, newCatName]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (partNumber.trim()) fd.append("partNumber", partNumber.trim());
      fd.append("price", price.trim());
      fd.append("stock", stock.trim());
      fd.append("status", status);
      if (description.trim()) fd.append("description", description.trim());

      if (selectedCat === NEW_CAT) {
        fd.append("newCategoryName", newCatName.trim());
      } else if (selectedCat !== NONE_CAT) {
        fd.append("categoryId", selectedCat);
      }

      if (file) fd.append("file", file, file.name);

      const res = await fetch("/api/catalog/parts", {
        method: "POST",
        body: fd, // без Content-Type
      });
      if (!res.ok) throw new Error(await res.text());

      toast.success("Новая запчасть успешно добавлена");
      resetLocalState();
      setOpen(false);
      r.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  function resetLocalState() {
    setSelectedCat(NONE_CAT);
    setNewCatName("");
    setStatus("IN_STOCK");
    setName("");
    setPartNumber("");
    setPrice("");
    setStock("");
    setDescription("");
    clearFile();
  }

  const fileBadge = useMemo(() => {
    if (!file) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
        <span className="truncate max-w-60">{file.name}</span>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={clearFile}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }, [file]);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErr(null); }}>
      <DialogTrigger asChild>
        <Button>Добавить запчасть</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Новая запчасть</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="name">Название *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="partNumber">№ детали (partNumber)</Label>
              <Input id="partNumber" value={partNumber} onChange={(e) => setPartNumber(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Категория</Label>
              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger>
                  <SelectValue placeholder={catsLoading ? "Загрузка…" : "Выберите категорию"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Действия</SelectLabel>
                    <SelectItem value={NONE_CAT}>— без категории —</SelectItem>
                    <SelectItem value={NEW_CAT}>➕ Добавить новую…</SelectItem>
                  </SelectGroup>
                  {cats.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Категории</SelectLabel>
                      {cats.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

              {selectedCat === NEW_CAT && (
                <Input
                  placeholder="Название новой категории"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label>Статус *</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_STOCK">В наличии</SelectItem>
                  <SelectItem value="ON_ORDER">Под заказ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Цена *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Остаток *</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2 grid gap-2">
              <Label>Фото</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={pickFile} disabled={saving}>
                  {file ? "Заменить файл" : "Загрузить файл"}
                </Button>
                {saving && (
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Сохраняю…
                  </span>
                )}
              </div>

              {filePreview && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={filePreview} alt="preview" className="h-20 w-20 rounded-md object-cover border" />
                  {fileBadge}
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              {saving ? "Сохраняю…" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
