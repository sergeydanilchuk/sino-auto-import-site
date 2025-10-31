"use client"

import { motion } from "framer-motion"
import { Award, Users, Globe } from "lucide-react"
import HomePageButton from "@/components/HomePageButton" // ✅ подключаем компонент кнопок

export default function AboutPage() {
  return (
    <section className="py-16 border-t border-border/40 bg-muted/40">
      <div className="container mx-auto px-12">
        {/* Заголовок и кнопки справа */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-2 text-left"
            >
              О компании Sino Auto Import
            </motion.h1>

            <p className="text-muted-foreground text-left max-w-2xl">
              Мы занимаемся поставкой автомобилей из стран Азии под ключ, обеспечивая прозрачность, безопасность и гарантированное качество на каждом этапе.
            </p>
          </div>

          {/* ✅ Здесь просто вызываем компонент кнопок */}
          <HomePageButton />
        </div>

        {/* Основной контент */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full p-6 md:p-10 bg-muted/40 backdrop-blur-sm border border-border/50 ring-1 ring-border/30 rounded-2xl leading-relaxed text-base md:text-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Кто мы и чем отличаемся
          </h2>

          <p className="text-[16px] text-muted-foreground mb-8">
            <span className="font-medium text-foreground">ООО "Сино Авто Импорт"</span> — это команда профессионалов
            в сфере международных автомобильных поставок. Мы помогаем клиентам из России
            приобрести автомобили напрямую с заводов и аукционов Китая, Южной Кореи и Японии.
            Наша миссия — сделать процесс покупки простым, безопасным и максимально выгодным.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="flex flex-col items-start gap-3">
              <Award className="w-8 h-8 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Надёжность и репутация</h3>
              <p className="text-[16px] text-muted-foreground">
                Работаем официально, с прозрачными договорами и отчётами на каждом этапе.
                Репутация и доверие клиентов — наш главный приоритет.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Users className="w-8 h-8 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Профессиональная команда</h3>
              <p className="text-[16px] text-muted-foreground">
                В нашем штате специалисты по логистике, таможенному оформлению и техническому контролю.
                Мы сопровождаем клиента от подбора авто до его постановки на учёт.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <Globe className="w-8 h-8 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Глобальные партнёры</h3>
              <p className="text-[16px] text-muted-foreground">
                Мы сотрудничаем с крупнейшими заводами и аукционами Китая, Кореи и Японии,
                что позволяет предлагать лучшие условия и проверенные автомобили.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Почему выбирают нас
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[16px] text-muted-foreground">
              <li>Работаем без посредников — напрямую с заводами и аукционами.</li>
              <li>Предоставляем полную отчётность и фото/видео на каждом этапе.</li>
              <li>Оформляем все документы в соответствии с российским законодательством.</li>
              <li>Гарантируем юридическую чистоту и прозрачность сделки.</li>
            </ul>
          </div>

          <p className="mt-12 text-lg text-foreground font-medium">
            Мы гордимся тем, что более <span className="text-primary font-semibold">80%</span> наших клиентов приходят
            по рекомендации.
          </p>
          <p className="text-lg text-foreground font-medium">
            "Сино Авто Импорт" — это надёжный партнёр, который сопровождает
            вас от первой консультации до получения автомобиля.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
