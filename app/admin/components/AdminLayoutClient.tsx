"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PanelLeft, LayoutDashboard, Users, FileText, Settings } from "lucide-react";

type Props = {
  children: React.ReactNode;
  userEmail: string;
};

const NAV = [
  { href: "/admin", label: "Главная", Icon: LayoutDashboard },
  { href: "/admin/users", label: "Пользователи", Icon: Users },
  { href: "/admin/posts", label: "Посты", Icon: FileText },
  { href: "/settings", label: "Настройки профиля", Icon: Settings },
];

export default function AdminLayoutClient({ children, userEmail }: Props) {
  // desktop collapse
  const [collapsed, setCollapsed] = useState(false);
  // mobile sheet
  const [open, setOpen] = useState(false);

  const SidebarNav = (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      {/* Заголовок */}
      <div
        className={cn(
          "text-xl font-bold transition-all duration-200",
          collapsed && "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        )}
      >
        Админ панель
      </div>

      {/* Навигация */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                "group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/60 transition-colors",
                collapsed && "justify-center gap-0"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {/* Текст целиком прячем при коллапсе без “просветов” */}
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-200",
                  collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
                )}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Подвал с email */}
      <div
        className={cn(
          "text-xs text-muted-foreground transition-all duration-200",
          collapsed ? "opacity-0 max-h-0 overflow-hidden pointer-events-none" : "opacity-100"
        )}
      >
        Вошёл: {userEmail}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={cn(
          "hidden md:block border-r border-border/40 bg-background/50 transition-[width] duration-200 ease-out overflow-hidden",
          collapsed ? "w-14" : "w-64"
        )}
      >
        <div className={cn("h-full", collapsed && "px-0")}>{SidebarNav}</div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with toggle + mobile menu */}
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border/40 bg-background/60 backdrop-blur px-4 md:px-6 h-14">
          {/* Desktop: collapse toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>

          {/* Mobile: open sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              {SidebarNav}
            </SheetContent>
          </Sheet>

          {/* Title placeholder */}
          <div className="ml-1 text-sm text-muted-foreground select-none">
            Панель администратора
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
