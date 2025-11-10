"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMaskInput } from "react-imask";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupForm({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shake, setShake] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const isPhoneComplete = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
  const isFormValid = name.trim() !== "" && isPhoneComplete;

  async function sendForm(data: FormData) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 сек ожидания

    try {
      const response = await fetch("https://formspree.io/f/xzzkejep", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return response;
    } catch (err: any) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid) {
      setShake(true);
      toast.error("Проверьте правильность заполнения формы ⚠️", {
        description: !name
          ? "Введите имя"
          : !isPhoneComplete
          ? "Введите полный номер телефона"
          : "",
      });
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await sendForm(data);

      if (response.ok) {
        const id = toast.success("Заявка успешно отправлена!", {
          description: "Мы свяжемся с вами в ближайшее время.",
          action: {
            label: "Ок",
            onClick: () => toast.dismiss(id),
          },
        });

        form.reset();
        setName("");
        setPhone("");
        setAttempt(0);
        setTimeout(() => setOpen(false), 800);
      } else {
        throw new Error("Ошибка при отправке");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        if (attempt < 1) {
          toast.warning("Сервер долго не отвечает ⏳", {
            description: "Повторная попытка через 3 секунды...",
          });
          setAttempt((prev) => prev + 1);
          setTimeout(() => handleSubmit(e), 3000);
        } else {
          toast.error("Не удалось отправить заявку 😕", {
            description: "Попробуйте позже или свяжитесь другим способом.",
          });
          setAttempt(0);
          setTimeout(() => setOpen(false), 1500);
        }
      } else {
        toast.warning("Сеть недоступна", {
          description: "Проверьте интернет и повторите попытку.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            size="lg"
            className="gap-2 cursor-pointer select-none transition active:scale-[0.98]"
          >
            Оставить заявку
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Оставьте заявку</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <AnimatePresence>
            <motion.div
              key="form"
              animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Имя */}
              <div className="grid gap-2">
                <Label htmlFor="name">Имя*</Label>
                <Input
                  id="name"
                  name="Имя"
                  required
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Телефон */}
              <div className="grid gap-2 mt-3">
                <Label htmlFor="phone">Телефон*</Label>
                <IMaskInput
                  mask="+7 (000) 000-00-00"
                  id="phone"
                  name="Телефон"
                  placeholder="+7 (999) 616-44-37"
                  required
                  value={phone}
                  onAccept={(value: any) => setPhone(value)}
                  className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {!isPhoneComplete && phone.length > 0 && (
                  <p className="text-sm text-red-500">
                    Введите полный номер телефона
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2 mt-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="Email"
                  type="email"
                  placeholder="user@mail.ru"
                />
              </div>

              {/* Интерес */}
              <div className="grid gap-2 mt-3">
                <Label>Что вас интересует?</Label>
                <Select name="Интерес">
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вариант" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Покупка авто себе">Покупка авто себе</SelectItem>
                    <SelectItem value="Покупка авто на компанию">Покупка авто на компанию</SelectItem>
                    <SelectItem value="Растаможка">Растаможка</SelectItem>
                    <SelectItem value="Партнёрство">Партнёрство</SelectItem>
                    <SelectItem value="Другое">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопка */}
              <Button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Отправка..." : "Отправить"}
              </Button>
            </motion.div>
          </AnimatePresence>
        </form>
      </DialogContent>
    </Dialog>
  );
}
