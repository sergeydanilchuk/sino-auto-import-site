"use client"

import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground">
        {/* Левая часть — копирайт */}
        <div className="text-center md:text-left">
          <p className="mb-1">
            Разработка сайта —{" "}
            <Link
              href="https://t.me/dan1lchuk"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Сергей Данильчук
            </Link>
          </p>
          <p>© {year} Sino Auto Import. Все права защищены.</p>
        </div>

        {/* Правая часть — ссылки */}
        <div className="flex space-x-4">
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="/terms"
            className="hover:text-primary transition-colors"
          >
            Условия использования
          </Link>
          <Link
            href="https://sinocreative.com"
            target="_blank"
            className="hover:text-primary transition-colors"
          >
            Партнерская программа
          </Link>
        </div>
      </div>
    </footer>
  )
}
