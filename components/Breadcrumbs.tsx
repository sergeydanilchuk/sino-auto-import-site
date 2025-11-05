"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, SlashIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils/utils"

// Карта путей для реальных страниц
const pathMap: Record<string, string> = {
  // Основные страницы
  "/about": "О компании",
  "/catalog": "Каталог авто", 
  "/contacts": "Контакты",
  "/faq": "Часто задаваемые вопросы",
  "/services": "Услуги",
  "/howorder": "Как заказать",
  
  // Услуги
  "/services/delivery": "Доставка",
  "/services/customs": "Растаможка",
}

interface BreadcrumbsProps {
  className?: string
  customItems?: Array<{ label: string; href?: string }>
}

export default function Breadcrumbs({ className, customItems }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Если на главной странице, не показываем breadcrumbs
  if (pathname === '/') return null
  
  // Если передан кастомный массив, используем его
  const items = customItems || (() => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    return pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      const label = pathMap[href] || segment.charAt(0).toUpperCase() + segment.slice(1)
      
      return {
        label,
        href: index === pathSegments.length - 1 ? undefined : href
      }
    })
  })()

  return (
    <div className={cn("container mx-auto px-4 sm:px-12 mb-6", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {/* Главная страница */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="sr-only">Главная</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {/* Динамически генерируем элементы с разделителями */}
          {items.flatMap((item, index) => [
            <BreadcrumbSeparator key={`separator-${index}`}>
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
            </BreadcrumbItem>
          ])}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}