"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Moon, Sun, Phone, Menu, FileText, Building, HelpCircle, UserRound } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"
import FlagIcon from "@/components/FlagIcon"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import LoginForm from "@/components/features/auth/LoginForm"
import RegisterForm from "@/components/features/auth/RegisterForm"
import { useMe } from "@/lib/useMe"
import { useRouter } from "next/navigation"
import { notifyAuth } from "@/lib/authBus"

function DropdownMenuNav({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; href: string; description: string; icon: string | React.ComponentType<any> }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsOpen(true) }
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => setIsOpen(false), 200) }
  const handleLinkClick = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsOpen(false) }
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const renderIcon = (icon: string | React.ComponentType<any>) => {
    if (typeof icon === "string") {
      if (["CN", "JP", "KR", "US", "RU"].includes(icon)) {
        return <FlagIcon countryCode={icon} size={16} className="flex-shrink-0" />
      }
      return <span className="text-base flex-shrink-0">{icon}</span>
    } else {
      const Icon = icon
      return <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
    }
  }

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={cn(
          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          isOpen && "bg-accent/50"
        )}
        onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }}
      >
        {title}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
             className={cn("ml-1 h-3 w-3 transition-transform duration-300", isOpen && "rotate-180")}>
          <path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-64 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 animate-in fade-in-0 zoom-in-95"
          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        >
          {items.map((item) => (
            <Link key={item.href} href={item.href}
                  className="relative flex cursor-pointer select-none items-start gap-3 rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  onClick={handleLinkClick}>
              <div className={cn("flex items-center justify-center mt-0.5 flex-shrink-0",
                                  typeof item.icon === "string" && !["CN","JP","KR","US","RU"].includes(item.icon) ? "w-4 h-4 text-base" : "w-4 h-4")}>
                {renderIcon(item.icon)}
              </div>
              <div className="flex flex-col">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function getInitials(name?: string, email?: string) {
  const base = (name && name.trim()) || email || ""
  const parts = base.replace(/<.*?>/g, "").split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { me, loading, mutate } = useMe()
  const [openAuth, setOpenAuth] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const r = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })

    await mutate({ user: null }, { revalidate: false })

    r.refresh()
    notifyAuth("logout")
  }

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const infoMenuItems = [
    { label: "Как заказать", href: "/howorder", description: "Описание процесса заказа автомобиля", icon: Building },
    { label: "О компании", href: "/about", description: "Узнайте детальнее о нашей компании", icon: FileText },
    { label: "Часто задаваемые вопросы", href: "/faq", description: "Ответы на популярные вопросы клиентов", icon: HelpCircle },
  ]

  const catalogMenuItems = [
    { label: "Авто из Китая", href: "/catalog/china", description: "Широкий выбор китайских автомобилей", icon: "CN" },
    { label: "Авто из Южной Кореи", href: "/catalog/korea", description: "Качественные корейские автомобили", icon: "KR" },
    { label: "Авто из Японии", href: "/catalog/japan", description: "Надежные японские автомобили", icon: "JP" },
  ]

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-12">
        {/* Левая часть: логотип + меню */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={theme === "dark" ? "/Logotype_v1_1_bt_v2.png" : "/Logotype_v1_1_lt_v2.png"}
              alt="Sino Auto Import Logo"
              width={120}
              height={32}
              priority
              className="h-8 w-auto transition-all duration-300 min-w-[120px] flex-shrink-0 select-none"
            />
          </Link>

          {/* Навигация — desktop */}
          <nav className="hidden xl:flex items-center space-x-1">
            <DropdownMenuNav title="Каталог авто" items={catalogMenuItems} />
            <DropdownMenuNav title="Информация" items={infoMenuItems} />
            <Link
              href="/#contacts"
              className="inline-flex h-9 items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Контакты
            </Link>
          </nav>
        </div>

        {/* Правая часть */}
        <div className="flex items-center space-x-3">
          {!loading && !me && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Войти или зарегистрироваться"
              onClick={() => { setAuthTab("login"); setOpenAuth(true); }}
              className="cursor-pointer"
            >
              <UserRound className="h-5 w-5" />
            </Button>
          )}

          {!loading && me && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent/50 px-2.5 py-1.5 hover:bg-accent transition-colors"
                  aria-label="Аккаунт"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={me?.avatarUrl || undefined} alt={me?.name || me?.email || "User"} />
                    <AvatarFallback>{getInitials(me?.name || undefined, me?.email || undefined)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[140px] truncate text-sm font-medium">
                    {me.name || me.email}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {me?.name || me?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {me?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Админка</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings">Профиль и аватар</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Кнопка звонка */}
          <Button variant="outline" size="default" asChild className="hidden lg:flex items-center space-x-2">
            <a href="tel:+79996164437" aria-label="Позвонить консультанту">
              <Phone className="h-[1.2rem] w-[1.2rem]" />
              <span>Позвонить</span>
            </a>
          </Button>

          {/* Telegram */}
          <Button variant="telegram" size="icon" asChild className="hidden sm:flex">
            <a href="https://t.me/sinoautoimport" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">
              <FaTelegramPlane className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>

          {/* WhatsApp */}
          <Button variant="whatsapp" size="icon" asChild className="hidden sm:flex">
            <a href="https://wa.me/79520849778" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp">
              <FaWhatsapp className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>

          {/* Переключатель темы */}
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="cursor-pointer">
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>

          {/* Мобильное меню */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="flex xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col space-y-4 p-6">
              <DialogTitle asChild>
                <VisuallyHidden>
                  <h2>Меню навигации</h2>
                </VisuallyHidden>
              </DialogTitle>

              <nav className="flex flex-col space-y-3 text-base">
                <div className="font-semibold text-muted-foreground mb-2">Каталог авто</div>
                {catalogMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-primary transition-colors pl-4 flex items-center gap-2">
                    <FlagIcon countryCode={typeof item.icon === "string" ? item.icon : ""} size={16} />
                    {item.label}
                  </Link>
                ))}

                <div className="border-t border-border/40 pt-3 mt-2">
                  <div className="font-semibold text-muted-foreground mb-2">Информация</div>
                  {infoMenuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-primary transition-colors pl-4 block py-1">
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-3 mt-2">
                  <Link href="/#contacts" className="hover:text-primary transition-colors block py-2">
                    Контакты
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Диалог вход/регистрация */}
      <Dialog open={openAuth} onOpenChange={setOpenAuth}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Аккаунт</DialogTitle>
            <DialogDescription>Войдите в аккаунт или создайте новый.</DialogDescription>
          </DialogHeader>

          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <LoginForm onDoneAction={() => setOpenAuth(false)} />
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <RegisterForm onDoneAction={() => setOpenAuth(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  )
}
