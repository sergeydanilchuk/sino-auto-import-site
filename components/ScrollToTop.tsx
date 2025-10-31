"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className={`fixed bottom-6 right-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              onClick={scrollToTop}
              size="icon"
              variant="secondary"
              className="rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="animate-in fade-in slide-in-from-right-2 duration-200"
          >
            Наверх
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
