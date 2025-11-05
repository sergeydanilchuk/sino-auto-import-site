"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onDoneAction?: () => void };

export default function LoginForm({ onDoneAction }: Props) {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = isEmail && password.trim().length >= 6;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    if (!isValid) {
      setShake(true);
      toast.error("Проверьте данные", {
        description: !isEmail
          ? "Некорректный email"
          : "Пароль должен быть не короче 6 символов",
      });
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || "Ошибка входа";
        setErr(msg);
        setShake(true);
        toast.error("Не удалось войти", { description: msg });
        setTimeout(() => setShake(false), 500);
        return;
      }

      toast.success("Вы вошли в аккаунт");
      onDoneAction?.(); // закрыть поп-ап
      r.refresh();      // обновить шапку (email/выход/админка)
    } catch {
      setErr("Сеть недоступна. Повторите попытку позже.");
      toast.warning("Проблема с сетью");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 py-2">
      <AnimatePresence>
        <motion.div
          key="login-form"
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="grid gap-3"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="user@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="pr-10"  // запас справа под иконку-глаз
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <Button
            type="submit"
            className="w-full mt-1 flex items-center justify-center gap-2 cursor-pointer"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Выполняем вход..." : "Войти"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <a href="/forgot" className="underline underline-offset-4">
              Забыли пароль?
            </a>
            <span className="text-muted-foreground">
              Нет аккаунта? <a href="/register" className="underline">Регистрация</a>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
