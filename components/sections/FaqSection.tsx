"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { faqData } from "@/data/faqData"

export default function FaqSection() {
  const faqItems = Object.values(faqData).flat().slice(0, 6)
  const [openItem, setOpenItem] = useState<string | null>(null)

  const leftColumn = faqItems.slice(0, Math.ceil(faqItems.length / 2))
  const rightColumn = faqItems.slice(Math.ceil(faqItems.length / 2))

  return (
    <section className="py-16 bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Заголовок + кнопка справа */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 text-left"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Часто задаваемые вопросы
            </h2>
            <p className="text-muted-foreground mb-2 md:mb-0 max-w-2xl">
              Ответы на самые популярные вопросы о подборе, доставке и оформлении авто.
            </p>
          </div>

          {/* Кнопка справа */}
          <Button asChild className="gap-2 cursor-pointer group self-start md:self-auto">
          <Link href="/faq" className="flex items-center gap-2">
            Посмотреть больше вопросов
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        </motion.div>

        {/* Две независимые колонки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {[leftColumn, rightColumn].map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6 self-start">
              {column.map((item, index) => {
                const value = `item-${colIndex}-${index}`
                const isOpen = openItem === value

                return (
                  <div
                    key={index}
                    className="border border-border/40 rounded-lg bg-background/70 hover:bg-background/90 transition-colors"
                  >
                    <button
                      onClick={() => setOpenItem(isOpen ? null : value)}
                      className="flex justify-between items-center w-full text-left font-medium text-base md:text-lg py-3 px-4"
                    >
                      {item.q}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pt-4 pb-4 text-muted-foreground text-sm md:text-base leading-relaxed border-t border-border/40 bg-accent/5 rounded-b-lg">
                            <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground/70 mb-2">
                              Ответ
                            </p>
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}