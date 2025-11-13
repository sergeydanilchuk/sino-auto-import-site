"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// Русские названия сегментов
const segmentLabels: Record<string, string> = {
  // Корневые страницы
  "about": "О компании",
  "catalog": "Каталог авто",
  "contacts": "Контакты",
  "faq": "Часто задаваемые вопросы",
  "services": "Услуги",
  "howorder": "Как заказать",

  // Подстраницы
  "delivery": "Доставка",
  "customs": "Растаможка",

  // Каталог авто
  "china": "Авто из Китая",
  "korea": "Авто из Кореи",
  "japan": "Авто из Японии",

  // Запчасти
  "parts": "Запчасти",

  // Технические страницы
  "admin": "Админка",
  "settings": "Настройки профиля",
};

interface BreadcrumbsProps {
  className?: string;
  customItems?: Array<{ label: string; href?: string }>;
}

export default function Breadcrumbs({ className, customItems }: BreadcrumbsProps) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  // Если переданы кастомные элементы — используем только их
  const items =
    customItems ||
    (() => {
      const segments = pathname.split("/").filter(Boolean);

      return segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        // Если сегмент известен — используем русское название
        const label =
          segmentLabels[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        const isLast = index === segments.length - 1;

        return {
          label,
          href: isLast ? undefined : href,
        };
      });
    })();

  return (
    <div className={cn("container mx-auto px-4 sm:px-12 mb-6", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {/* Главная */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="sr-only">Главная</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Остальные */}
          {items.flatMap((item, index) => [
            <BreadcrumbSeparator key={`sep-${index}`}>
              <SlashIcon />
            </BreadcrumbSeparator>,

            <BreadcrumbItem key={`item-${index}`}>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>,
          ])}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
