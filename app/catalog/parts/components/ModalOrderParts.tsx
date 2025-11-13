// app/catalog/parts/components/ModalOrderParts.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IMaskInput } from "react-imask";

type OrderItem = {
  id: string;
  name: string;
  price: string | number;
  imageUrl?: string | null;
  category?: { id: string; name: string } | null;
  sku?: string | null;
};

type ModalOrderPartsProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  item: OrderItem | null;
};

export default function ModalOrderParts({
  open,
  onOpenChangeAction,
  item,
}: ModalOrderPartsProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // проверка формата +7 (000) 000-00-00
  const isPhoneComplete = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
  const isFormValid = name.trim() !== "" && isPhoneComplete && !!item;

  useEffect(() => {
    if (open) {
      setName("");
      setPhone("");
      setComment("");
      setSubmitting(false);
    }
  }, [open, item?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !isFormValid || submitting) return;

    setSubmitting(true);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          name,
          phone,
          comment,
        }),
      });

      onOpenChangeAction(false);
      alert("Заявка отправлена. Мы свяжемся с вами в ближайшее время.");
    } catch {
      alert("Ошибка отправки. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle>Оформление заявки</DialogTitle>
          <DialogDescription>
            Укажите контакты, и наш менеджер свяжется с вами.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Блок выбранной запчасти */}
          {item && (
            <div className="mb-4 p-4 rounded-lg border bg-muted/30 flex gap-4">
              <div className="shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-28 rounded-md object-cover border border-border/50"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border/50">
                    Нет фото
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="font-semibold text-base">{item.name}</p>

                  {item.category?.name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.category.name}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex flex-col items-start gap-1">
                  <span className="text-lg font-semibold">
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    }).format(Number(item.price))}
                  </span>

                  {item.sku && (
                    <span className="text-[11px] text-muted-foreground">
                      SKU: {item.sku}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Форма */}
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Ваше имя</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите имя"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Телефон</Label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={phone}
                onAccept={(value: any) => setPhone(value)}
                placeholder="+7 (999) 616-44-37"
                className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {!isPhoneComplete && phone.length > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Введите полный номер телефона
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Комментарий</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Уточните детали, VIN, пожелания…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!isFormValid || submitting}>
              {submitting ? "Отправка..." : "Отправить заявку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
