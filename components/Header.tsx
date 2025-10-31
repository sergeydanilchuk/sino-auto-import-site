"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Moon, Sun, Phone, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-12">
        {/* Левая часть: логотип + меню */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={
                theme === "dark"
                  ? "/Logotype_v1_1_bt_v2.png"
                  : "/Logotype_v1_1_lt_v2.png"
              }
              alt="Sino Auto Import Logo"
              width={120}
              height={32}
              priority
              className="h-8 w-auto transition-all duration-300 min-w-[120px] flex-shrink-0 select-none"
            />
          </Link>

          {/* Навигация — desktop */}
          <nav className="hidden xl:flex items-center space-x-4 text-sm font-medium">
            <TooltipProvider delayDuration={100}>
              {[
                { label: "Как заказать", href: "/info/howorder" },
                { label: "Каталог авто", disabled: true },
                { label: "О компании", href: "/info/about" },
                { label: "Контакты", href: "/#contacts" },
              ].map((item) =>
                item.disabled ? (
                  <Tooltip key={item.label} disableHoverableContent={false}>
                    <TooltipTrigger asChild>
                      <div
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => e.preventDefault()}
                        className="transition-colors duration-300 font-normal opacity-70 cursor-not-allowed select-none px-4 py-2 rounded-md hover:bg-accent/20"
                      >
                        {item.label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-sm select-none pointer-events-none"
                    >
                      🚧 Раздел в разработке
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    key={item.href ?? item.label}
                    asChild
                    variant="ghost"
                    className="transition-colors duration-300 hover:text-primary font-normal"
                  >
                    <Link href={item.href ?? "/"}>{item.label}</Link>
                  </Button>
                )
              )}
            </TooltipProvider>
          </nav>
        </div>

        {/* Правая часть */}
        <div className="flex items-center space-x-3">
          {/* Кнопка звонка */}
          <Button
            variant="outline"
            size="default"
            asChild
            className="hidden lg:flex items-center space-x-2"
          >
            <a href="tel:+79996164437" aria-label="Позвонить консультанту">
              <Phone className="h-[1.2rem] w-[1.2rem]" />
              <span>Позвонить консультанту</span>
            </a>
          </Button>

          {/* Telegram */}
          <Button
            variant="telegram"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <a
              href="https://t.me/sinoautoimport"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
            >
              <FaTelegramPlane className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>

          {/* WhatsApp */}
          <Button
            variant="whatsapp"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <a
              href="https://wa.me/79520849778"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
            >
              <FaWhatsapp className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>

          {/* Переключатель темы */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          {/* Мобильное меню */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="flex xl:hidden"
              >
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
              {[
                { label: "Как заказать", href: "/howorder" },
                { label: "Каталог авто", disabled: true },
                { label: "О компании", href: "/about" },
                { label: "Контакты", href: "/#contacts" },
              ].map((item) =>
                item.disabled ? (
                  <span
                    key={item.label}
                    className="opacity-70 cursor-not-allowed select-none"
                  >
                    {item.label} 🚧
                  </span>
                ) : (
                  <Link
                    key={item.href ?? item.label}
                    href={item.href ?? "/"}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
