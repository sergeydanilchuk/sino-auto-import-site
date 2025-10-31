"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Car, ShieldCheck, Globe, Wallet, FileText, ChevronDown, Quote, Phone } from "lucide-react"
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa"
import PopupForm from "@/components/PopupForm"
import VideoSection from "@/components/sections/VideoSection";
import FaqSection from "@/components/sections/FaqSection"
import YandexMap from "@/components/YandexMap";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Секция с картинкой и главным текстом */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-40 px-12 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
        >
          Автомобили из{" "}
          <span className="text-primary">Китая</span>,{" "}
          <span className="text-primary">Южной Кореи</span> и{" "}
          <span className="text-primary">Японии</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-muted-foreground max-w-2xl mb-8"
        >
          Полный цикл импорта: от подбора и проверки до доставки и растаможки. 
          Прозрачные условия и персональный менеджер.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button asChild variant="outline">
            <Link href="/how">Подробнее о процессе</Link>
          </Button>
        </motion.div>
        <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[url('/cars-bg.jpg')] bg-cover bg-center" />
      </section>

      {/* Почему выбирают нас? */}
      <section className="py-16 border-t border-border/40">
        <div className="container mx-auto px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-2 text-left"
          >
            Почему выбирают нас?
          </motion.h2>

          <p className="text-muted-foreground mb-12 text-left max-w-2xl">
            Мы сопровождаем клиента на каждом этапе — от выбора до получения ключей.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Car,
                title: "Большой выбор авто",
                text: "Доступ ко всем крупным аукционам Китая, Кореи и Японии.",
              },
              {
                icon: ShieldCheck,
                title: "Проверенные поставщики",
                text: "Работаем только с сертифицированными экспортёрами.",
              },
              {
                icon: Wallet,
                title: "Прозрачная цена",
                text: "Вы знаете каждую статью расходов — без скрытых комиссий.",
              },
              {
                icon: Globe,
                title: "Доставка по всей России",
                text: "Организуем таможню и логистику «под ключ» до вашего города.",
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Card
                key={i}
                className="p-6 flex flex-col justify-center items-center text-center h-full"
              >
                <CardContent className="flex flex-col items-center justify-center text-center gap-2 h-full p-0">
                  <Icon className="w-8 h-8 text-primary mb-1" />
                  <h3 className="font-semibold text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Клиенты */}
      <section className="py-16 border-t border-border/40">
        <div className="container mx-auto px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-2 text-left"
          >
            Довольные клиенты
          </motion.h2>

          <p className="text-muted-foreground mb-12 text-left max-w-2xl">
            Каждый день мы помогаем людям по всей России получить свой автомобиль из Китая, Южной Кореи и Японии.
          </p>

          {(() => {
            const clients = [
              {
                name: "Наталья",
                city: "Тюмень",
                car: "Lynk & Co 05",
                year: "2021",
                img: "client_01.jpg",
                review: "Отличный сервис! Всё прошло гладко — от подбора до доставки. Машина в идеальном состоянии!",
              },
              {
                name: "Ирина",
                city: "Екатеринбург",
                car: "Haval Jolion",
                year: "2022",
                img: "client_02.jpg",
                review: "Спасибо Sino Auto Import за прозрачную работу! Постоянно были на связи и помогли со всеми документами.",
              },
              {
                name: "Павел",
                city: "Новосибирск",
                car: "Chery Tiggo 8 Pro",
                year: "2023",
                img: "client_03.jpg",
                review: "Машина пришла даже раньше срока. Очень доволен качеством и подходом!",
              },
              {
                name: "Наталья",
                city: "Казань",
                car: "Geely Monjaro",
                year: "2023",
                img: "client_04.jpg",
                review: "Отличная компания! Всё честно, быстро и с заботой о клиенте. Рекомендую друзьям.",
              },
              {
                name: "Дмитрий",
                city: "Краснодар",
                car: "Toyota Crown",
                year: "2022",
                img: "client_05.jpg",
                review: "Никогда не думал, что покупка машины из Японии может быть настолько лёгкой. Спасибо за помощь!",
              },
              {
                name: "Евгений",
                city: "Санкт-Петербург",
                car: "Lixiang L9",
                year: "2024",
                img: "client_06.jpg",
                review: "Сервис на уровне. Авто получил без единой царапины, всё чётко по договору.",
              },
              {
                name: "Ольга",
                city: "Пермь",
                car: "Hyundai Palisade",
                year: "2023",
                img: "client_07.jpg",
                review: "Очень довольна! Ребята всё объяснили, помогли с таможней и даже с регистрацией.",
              },
              {
                name: "Сергей",
                city: "Владивосток",
                car: "Mercedes-Benz C-Class",
                year: "2023",
                img: "client_08.jpg",
                review: "Отличная работа! Машину доставили быстро, на все вопросы отвечали оперативно.",
              },
            ];

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {clients.map((client, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col cursor-pointer">
                          <img
                            src={`/clients/${client.img}`}
                            alt={`Клиент ${client.name}`}
                            className="w-full h-48 object-cover"
                          />
                          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between text-left grow gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-lg whitespace-normal break-words">
                                {client.name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">{client.city}</p>
                            </div>
                            <div className="flex flex-col sm:items-end min-w-0 sm:ml-4">
                              <p className="text-sm font-medium text-primary flex items-center gap-1 flex-nowrap truncate max-w-[150px] sm:max-w-[200px]">
                                <Car className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{client.car}</span>
                              </p>
                              <Badge variant="secondary" className="mt-1 self-start sm:self-end">
                                {client.year}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      {/* ✅ Модалка адаптирована и кнопка перенесена ниже отзыва */}
                      <DialogContent className="max-w-[95vw] sm:max-w-3xl w-full p-4 sm:p-6 rounded-xl">
                      {/* Фото клиента */}
                      <div className="w-full aspect-video overflow-hidden rounded-md">
                        <img
                          src={`/clients/${client.img}`}
                          alt={`Клиент ${client.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Заголовок */}
                      <DialogHeader className="mt-3 text-center sm:text-left space-y-1">
                        <DialogTitle className="text-lg sm:text-xl font-semibold">
                          {client.name} — {client.car}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                          {client.city}, {client.year}
                        </p>
                      </DialogHeader>

                      {/* Отзыв (с двумя кавычками и чуть темнее фоном) */}
                      <div className="mt-4 mb-5 bg-muted/60 p-5 rounded-lg border border-border relative">
                        <Quote className="absolute -top-3 -left-2 w-6 h-6 text-muted-foreground/50" />
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center sm:text-left italic">
                          “{client.review}”
                        </p>
                        <Quote className="absolute -bottom-3 -right-2 w-6 h-6 text-muted-foreground/50 rotate-180" />
                      </div>

                      {/* Кнопка */}
                      <div className="flex justify-center sm:justify-start">
                        <PopupForm>
                          <Button className="gap-2 cursor-pointer">
                            <ChevronDown className="w-4 h-4" />
                            Подобрать похожий авто
                          </Button>
                        </PopupForm>
                      </div>
                    </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Этапы работы */}
      <section className="py-16 border-t border-border/40">
        <div className="container mx-auto px-12">
          {/* Заголовок и кнопки справа */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-2 text-left"
              >
                Поэтапная схема работы
              </motion.h2>

              <p className="text-muted-foreground text-left max-w-2xl">
                Всё просто и прозрачно — от заявки до получения автомобиля.
              </p>
            </div>

            {/* Кнопки справа от заголовка */}
            <div className="flex flex-wrap gap-4 self-start md:self-auto">
              <PopupForm>
                <Button className="gap-2 cursor-pointer">
                  <Car className="w-4 h-4" />
                  Заказать авто
                </Button>
              </PopupForm>
              <Button
                className="gap-2 cursor-pointer"
                onClick={() => window.open("/docs/Проект_агентского_договора.pdf", "_blank")}
              >
                <FileText className="w-4 h-4" />
                Пример договора
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: 1,
                title: "Оставьте заявку",
                desc: "Укажите марку, модель и бюджет. Менеджер проконсультирует по выбору и доставке.",
              },
              {
                num: 2,
                title: "Подбор авто",
                desc: "Подберем варианты по вашим параметрам, фото, видео и отчёты о состоянии.",
              },
              {
                num: 3,
                title: "Договор и предоплата",
                desc: "Заключаем договор, вы вносите предоплату — начинаем оформление.",
              },
              {
                num: 4,
                title: "Доставка",
                desc: "Организуем перевозку морским, авто- или авиатранспортом.",
              },
              {
                num: 5,
                title: "Растаможка",
                desc: "Поможем с расчётом пошлин и оформлением всех документов.",
              },
              {
                num: 6,
                title: "Передача авто",
                desc: "Передаём авто с полным пакетом документов и помогаем с регистрацией.",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all"
              >
                <CardContent className="flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <VideoSection
        mainVideo="https://vkvideo.ru/video_ext.php?oid=-224371418&id=456239114&hd=2"
        videos={[
          "https://vkvideo.ru/video_ext.php?oid=-224371418&id=456239103&hd=2",
          "https://vkvideo.ru/video_ext.php?oid=-224371418&id=456239076&hd=2",
          "https://vkvideo.ru/video_ext.php?oid=-224371418&id=456239062&hd=2",
          "https://vkvideo.ru/video_ext.php?oid=-224371418&id=456239046&hd=2",
        ]}
      />

      {/* Контакты */}
      <section id="contacts" className="py-20 border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-2 text-left"
          >
            Контакты
          </motion.h2>

          <p className="text-muted-foreground mb-12 text-left max-w-2xl">
            Оставьте заявку или напишите нам удобным способом — мы ответим в течение 15 минут.
          </p>

          {/* Карточки контактов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Телефон */}
            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Phone className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1">Телефон</h3>
              <a href="tel:+79996164437" className="text-primary hover:underline text-base">
                +7 (999) 616-44-37
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Проконсультируем абсолютно бесплатно
              </p>
            </Card>

            {/* Telegram */}
            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <FaTelegramPlane className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1">Telegram</h3>
              <a
                href="https://t.me/sinoautoimport"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base"
              >
                @sinoautoimport
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Канал с подборками и новостями авторынка
              </p>
            </Card>

            {/* WhatsApp */}
            <Card className="p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <FaWhatsapp className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
              <a
                href="https://wa.me/79520849778"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-base"
              >
                +7 (952) 084-97-78
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                Поддержка клиентов 24/7
              </p>
            </Card>
          </div>

          {/* Карта и адрес */}
          <div className="mt-20">
            <h3 className="text-2xl font-semibold mb-3 text-left">Наш офис</h3>
            <p className="text-muted-foreground mb-8 text-left">
              Шоссейный переулок, 2, Артём, Приморский край
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-border/40 shadow-sm bg-background"
            >
              <YandexMap />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}