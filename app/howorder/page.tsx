"use client"

import { Button } from "@/components/ui/button"
import { Car, FileText } from "lucide-react"
import PopupForm from "@/components/dialogs/PopupForm"
import Breadcrumbs from "@/components/Breadcrumbs"

export default function HowOrderPage() {
  return (
    <section className="py-16 border-t border-border/40 bg-muted/40">
      <Breadcrumbs />
      <div className="container mx-auto px-12">
        {/* Заголовок и кнопка справа */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-left">
              Как заказать?
            </h1>

            <p className="text-muted-foreground text-left max-w-2xl">
              Подробная инструкция по оформлению заказа автомобиля с заводов и аукционов Китая, Кореи и Японии — просто, безопасно и под полным сопровождением.
            </p>
          </div>
        </div>

        {/* Основной текст инструкции */}
        <div className="mx-auto bg-md:w-3/4 w-full p-6 md:p-10 bg-muted/40 backdrop-blur-sm border border-border/50 ring-1 ring-border/30 rounded-2xl leading-relaxed text-base md:text-lg">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Пошаговая инструкция по заказу автомобиля
          </h2>

          <ol className="list-decimal list-inside space-y-8">
            <li>
              <strong className="text-lg text-foreground font-medium">
                Оставьте заявку или свяжитесь с нами любым удобным способом.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                Вы можете заполнить короткую форму на сайте, написать в Telegram, WhatsApp или позвонить напрямую.  
                Наш менеджер уточнит ключевые детали: бюджет, марку и модель, желаемую страну поставки, комплектацию, год выпуска и сроки.  
                Мы всегда готовы помочь подобрать оптимальный вариант даже тем, кто впервые сталкивается с покупкой автомобиля из-за рубежа.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Подбор автомобиля и расчёт полной стоимости.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                После получения ваших пожеланий мы проводим подбор по открытым базам аукционов, дилерских площадок и проверенных партнёров в Китае, Корее и Японии.  
                Вы получаете подробное предложение с фотографиями, VIN-кодом, пробегом, техническим описанием и полным расчётом — от стоимости выкупа до всех пошлин, логистики и услуг под ключ.  
                Если нужно, мы предложим несколько альтернатив в разных ценовых диапазонах.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Заключение договора и внесение предоплаты.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                После того как вы выбрали конкретный автомобиль, заключается официальный агентский договор с Sino Auto Import.  
                Он полностью защищает ваши интересы — вы видите каждый пункт и заранее знаете, как распределяются платежи.  
                Предоплата (обычно 10–30% от общей суммы) вносится для фиксации выбранного лота и начала закупки.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Покупка автомобиля и отправка из страны происхождения.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                Мы выкупаем авто через партнёров, проверяем техническое состояние и оригинальность документов.  
                Далее организуем транспортировку — морем, железной дорогой или автовозом — до Владивостока, Санкт-Петербурга или другого логистического узла.  
                Вы регулярно получаете фото, видео и отчёты о каждом этапе перемещения.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Таможенное оформление и получение ПТС.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                После прибытия в Россию мы выполняем все процедуры оформления: уплата пошлин, сертификация, оформление электронного ПТС.  
                Клиент не тратит время на бюрократию — всё под ключ и строго в рамках законодательства.  
                Вы можете запросить копии всех документов на любом этапе.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Доставка автомобиля клиенту.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                После завершения таможни автомобиль можно забрать самостоятельно или заказать доставку по вашему адресу.  
                Мы также можем организовать транспортировку по регионам, постановку на учёт и помощь со страхованием.  
                В результате вы получаете полностью готовый к эксплуатации автомобиль — официально, прозрачно и без скрытых платежей.
              </p>
              <hr className="my-6 border-border/40" />
            </li>

            <li>
              <strong className="text-lg text-foreground font-medium">
                Поддержка после покупки.
              </strong>
              <p className="text-base text-muted-foreground mt-1">
                Мы остаёмся на связи и после передачи авто. Консультируем по постановке на учёт, гарантийному обслуживанию, дополнительным опциям и техническим вопросам.  
                Наша цель — чтобы вы остались довольны не только автомобилем, но и всем процессом его приобретения.
              </p>
            </li>
          </ol>

          {/* Призыв к действию */}
          <p className="mt-10 text-lg text-foreground font-medium">
            Готовы сделать первый шаг?  
            Отправьте заявку или посмотрите пример договора ниже — и уже сегодня мы подберём для вас лучший автомобиль из Китая, Кореи или Японии.
          </p>

          {/* Кнопки снизу */}
          <div className="mt-12 flex flex-wrap gap-4 self-start md:self-auto">
            <PopupForm>
              <Button className="gap-2 cursor-pointer">
                <Car className="w-4 h-4" />
                Заказать авто
              </Button>
            </PopupForm>

            <Button
              className="gap-2 cursor-pointer"
              onClick={() =>
                window.open("/docs/Проект_агентского_договора.pdf", "_blank")
              }
            >
              <FileText className="w-4 h-4" />
              Пример договора
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}