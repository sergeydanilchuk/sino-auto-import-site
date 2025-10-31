"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function HomePageButton() {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-4 self-start md:self-auto">
      {/* Кнопка только с иконкой Назад */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center justify-center cursor-pointer h-9 w-9"
        title="Назад"
      >
        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
      </Button>

      {/* Кнопка На главную с текстом */}
      <Button
        variant="outline"
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer h-9 px-8 text-sm font-medium"
      >
        <Home className="w-4 h-4 text-muted-foreground" />
        На главную
      </Button>
    </div>
  )
}
