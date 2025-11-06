"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
// Tooltip (shadcn/ui)
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = { onDoneAction?: () => void };

export default function RegisterForm({ onDoneAction }: Props) {
  const r = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pwdFocused, setPwdFocused] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const pwdRef = useRef<HTMLInputElement>(null);

  // Разрешённые спецсимволы: ! @ # $ % ^ & * ( ) - _ = + { } [ ] : " \
  const allowedSpecialRe = /[!@#$%^&*()\-\_\=\+{}\[\]:"\\]/;
  const forbiddenSpecialRe = /[^A-Za-z0-9!@#$%^&*()\-\_\=\+{}\[\]:"\\]/;

  // === 3 уровня (Слабый/Средний/Сильный) ===
  function getPasswordLevel(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    if (/[А-Яа-яЁё]/.test(pw)) return 0;      // запрет кириллицы
    if (forbiddenSpecialRe.test(pw)) return 0; // запрет иных спецсимволов
    if (pw.length < 6) return 0;

    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasLetter = hasLower || hasUpper;
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecial = allowedSpecialRe.test(pw);
    const mixedCase = hasLower && hasUpper;

    const categories =
      (hasLetter ? 1 : 0) + (hasDigit ? 1 : 0) + (hasSpecial ? 1 : 0);

    if (categories >= 3 && mixedCase) return 3;                 // Сильный
    if (categories >= 3 || (categories >= 2 && mixedCase)) return 2; // Средний
    if (categories >= 2) return 1;                               // Слабый
    return 0;
  }

  function getHintsList(pw: string): string[] {
    const hints: string[] = [];
    if (!pw) return ["Начните ввод пароля"];
    if (/[А-Яа-яЁё]/.test(pw)) hints.push("Только латиница");
    if (pw.length < 6) hints.push("Минимум 6 символов");
    if (forbiddenSpecialRe.test(pw))
      hints.push('Разрешены только: ! @ # $ % ^ & * ( ) - _ = + { } [ ] : " \\');
    if (!/[A-Z]/.test(pw)) hints.push("Добавьте заглавную букву");
    if (!/[a-z]/.test(pw)) hints.push("Добавьте строчную букву");
    if (!/[0-9]/.test(pw)) hints.push("Добавьте цифру");
    if (!allowedSpecialRe.test(pw))
      hints.push('Добавьте разрешённый спецсимвол (например, !, @, #, " или \\)');
    return hints;
  }

  const level = getPasswordLevel(password);
  const strengthLabel =
    level === 0 ? "Недопустимый" : level === 1 ? "Слабый" : level === 2 ? "Средний" : "Сильный";

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // регистрация по-прежнему требует «Сильный»
  const meetsMinStrength = level >= 3;

  const isValid =
    name.trim().length > 0 &&
    isEmail &&
    confirm === password &&
    meetsMinStrength;

  // Цвета бэджа
  const badgeClasses =
    level <= 1
      ? "bg-red-100 text-red-700 ring-red-200"
      : level === 2
      ? "bg-yellow-100 text-yellow-800 ring-yellow-200"
      : "bg-green-100 text-green-700 ring-green-200";

  // Авто-открытие тултипа
  const tooltipOpen =
    (pwdFocused && password.length > 0 && level < 3) ||
    (submittedOnce && !meetsMinStrength);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setSubmittedOnce(true);

    if (!isValid) {
      setShake(true);

      let description = "";
      if (!name.trim()) {
        description = "Введите имя";
      } else if (!isEmail) {
        description = "Некорректный e-mail";
      } else if (password.length < 6) {
        description = "Пароль должен содержать минимум 6 символов.";
      } else if (/[А-Яа-яЁё]/.test(password)) {
        description = "Пароль не может содержать кириллицу — используйте латиницу.";
      } else if (forbiddenSpecialRe.test(password)) {
        description = 'Недопустимые символы. Разрешены только: ! @ # $ % ^ & * ( ) - _ = + { } [ ] : " \\';
      } else if (confirm !== password) {
        description = "Пароли не совпадают";
      } else if (!meetsMinStrength) {
        description = "Нужен уровень «Сильный». Подсказки — продолжайте ввод или посмотрите в бэдж.";
      }

      toast.error("Проверьте корректность данных", { description });
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || "Ошибка регистрации";
        setErr(msg);
        setShake(true);
        toast.error("Не удалось создать аккаунт", { description: msg });
        setTimeout(() => setShake(false), 500);
        return;
      }

      toast.success("Аккаунт успешно создан ✅");
      onDoneAction?.();
      r.refresh();
    } catch {
      setErr("Сеть недоступна. Повторите позже.");
      toast.warning("Проблема с сетью");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 py-2">
      <AnimatePresence>
        <motion.div
          key="register-form"
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="grid gap-3"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

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

          {/* Пароль */}
          <div className="grid gap-1.5">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                ref={pwdRef}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Не менее 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPwdFocused(true)}
                onBlur={() => setPwdFocused(false)}
                autoComplete="new-password"
                className="pr-28"
              />

              {/* Бэдж индикатор + точная привязка тултипа */}
              <div className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2">
                <TooltipProvider delayDuration={0}>
                  <Tooltip open={tooltipOpen}>
                    <div className="relative inline-block">
                      {/* Бэдж (неинтерактивный) */}
                      <span
                        className={
                          "inline-flex items-center gap-1 text-[10px] leading-none px-2 py-1 rounded-full ring-1 transition-all duration-200 transition-colors select-none " +
                          (password.length === 0 ? "opacity-0 scale-95" : "opacity-100 scale-100") +
                          " " +
                          badgeClasses
                        }
                        aria-label={`Сложность: ${strengthLabel}`}
                      >
                        {level === 3 ? (
                          <Check size={12} strokeWidth={2} />
                        ) : (
                          <AlertTriangle size={12} strokeWidth={2} />
                        )}
                        {strengthLabel}
                      </span>

                      {/* Нулевой «якорь» в правом нижнем углу бэджа — это Trigger */}
                      <TooltipTrigger asChild>
                        <span className="absolute bottom-0 right-0 w-0 h-0" />
                      </TooltipTrigger>
                    </div>

                    {/* Верхний левый угол тултипа = правый нижний угол бэджа */}
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={0}
                      avoidCollisions={false}
                      className="max-w-xs text-xs data-[side=bottom]:origin-top-left"
                    >
                      <ul className="list-disc pl-4 space-y-1">
                        {getHintsList(password).slice(0, 3).map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

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

          {/* Подтверждение */}
          <div className="grid gap-2">
            <Label htmlFor="confirm">Подтвердите пароль</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Повторите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? "Скрыть пароль" : "Показать пароль"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
            {loading ? "Создаём..." : "Создать аккаунт"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Регистрируясь, вы принимаете{" "}
            <a href="/privacy" className="underline underline-offset-4">
              политику конфиденциальности
            </a>
            .
          </p>
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
