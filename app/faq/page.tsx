"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ChevronDown, Info } from "lucide-react"
import { faqData } from "@/data/faqData"
import { cn } from "@/lib/utils/utils"
import HomePageButton from "@/components/HomePageButton"

export default function FaqPage() {
  const categories = Object.keys(faqData).sort((a, b) => a.localeCompare(b, "ru"))
  const [currentTab, setCurrentTab] = useState(categories[0])
  const [search, setSearch] = useState("")
  const [openItem, setOpenItem] = useState<string | null>(null)

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="py-16 bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-12">
        {/* Заголовок и кнопка справа */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-2 text-left"
            >
              Часто задаваемые вопросы
            </motion.h1>

            <p className="text-muted-foreground text-left max-w-2xl">
              Найдите ответы на вопросы о покупке, доставке и оформлении автомобилей.
            </p>
          </div>

          {/* Кнопка справа, выровненная по верхнему краю */}
          <div className="flex flex-wrap gap-4 self-start">
            <HomePageButton />
          </div>
        </div>

        {/* Основная секция */}
        <div className="w-full flex justify-center">
          <div className="w-full bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 ring-1 ring-border/30 overflow-hidden">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/40">
              
              {/* Левая панель категорий */}
              <aside className="md:w-1/4 w-full bg-muted/60 p-6 md:p-8 md:h-[65vh] flex flex-col">
                <div className="space-y-3 mb-4">
                  <Input
                    type="search"
                    placeholder="Поиск категории..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full text-sm bg-background/90 border-border/40"
                  />
                </div>

                <ScrollArea className="flex-1 border-t border-border/40 pt-3 pr-2 md:pr-3">
                  <div className="flex flex-col space-y-1">
                    {filteredCategories.length ? (
                      filteredCategories.map((cat) => {
                        const isActive = currentTab === cat
                        return (
                          <motion.button
                            key={cat}
                            onClick={() => {
                              setCurrentTab(cat)
                              setOpenItem(null)
                            }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md text-sm md:text-base font-medium cursor-pointer select-none",
                              "transition-colors duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            )}
                          >
                            {cat}
                          </motion.button>
                        )
                      })
                    ) : (
                      <p className="text-muted-foreground text-sm px-3 mt-2">
                        Ничего не найдено
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </aside>

              {/* Контент с вопросами */}
              <div className="md:w-3/4 w-full p-6 md:p-10 bg-muted/40">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  {categories.map((cat) => {
                    const validItems = (faqData[cat] || []).filter(
                      (item) => item?.q && item?.a
                    )
                    const isEmpty = validItems.length === 0

                    return (
                      <TabsContent key={cat} value={cat} className="w-full">
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="text-2xl font-semibold mb-6 border-b border-border/40 pb-2"
                        >
                          {cat}
                        </motion.h2>

                        {isEmpty ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border/40 rounded-xl bg-background/50"
                          >
                            <Info className="w-10 h-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-semibold mb-1">
                              Мы ещё работаем над этой категорией
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-md">
                              Совсем скоро здесь появятся ответы на популярные вопросы по этой теме.
                            </p>
                          </motion.div>
                        ) : (
                          <div className="space-y-3">
                            {validItems.map((item, index) => {
                              const value = `item-${cat}-${index}`
                              const isOpen = openItem === value

                              return (
                                <motion.div
                                  key={index}
                                  className="border border-border/40 rounded-lg bg-background/70 hover:bg-background/90 transition-colors"
                                  layout
                                >
                                  <button
                                    onClick={() =>
                                      setOpenItem(isOpen ? null : value)
                                    }
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
                                </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </TabsContent>
                    )
                  })}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
