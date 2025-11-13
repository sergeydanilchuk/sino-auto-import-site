// app/catalog/parts/[id]/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";

const fmt = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
});

type Params = { id: string };

type Props = {
  params: Promise<Params>; // как в api/route.ts
};

export default async function PartPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const part = await prisma.part.findUnique({
    where: { id },
    select: {
      id: true,
      sku: true,
      name: true,
      partNumber: true,
      price: true,
      stock: true,
      status: true,
      imageUrl: true,
      description: true,
      category: { select: { id: true, name: true } },
    },
  });

  if (!part) {
    notFound();
  }

  return (
    <section className="py-16 bg-muted/50 border-t border-border">
      <Breadcrumbs />

      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {part.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
            {part.sku && <span>SKU: {part.sku}</span>}
            {part.partNumber && (
              <>
                <span className="text-border">•</span>
                <span>Номер детали: {part.partNumber}</span>
              </>
            )}
            {part.category?.name && (
              <>
                <span className="text-border">•</span>
                <span>Категория: {part.category.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          {/* Левая колонка: картинка + описание */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-4/3 w-full bg-muted flex items-center justify-center">
                  {part.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Фото пока нет
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {part.description && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">
                    Описание
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {part.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Правая колонка: цена, наличие, действия */}
          <div className="space-y-4 lg:space-y-5">
            <Card>
              <CardContent className="pt-5 pb-4 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Цена
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">
                    {fmt.format(Number(part.price))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge
                    variant={part.status === "IN_STOCK" ? "default" : "secondary"}
                    className="text-xs px-2.5 py-0.5"
                  >
                    {part.status === "IN_STOCK" ? "В наличии" : "Под заказ"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Остаток:{" "}
                    <span className="font-medium text-foreground">
                      {part.stock}
                    </span>
                  </span>
                </div>

                <div className="pt-2 border-t border-border/70 space-y-2">
                  <Button
                    type="button"
                    className="w-full text-sm"
                    asChild
                  >
                    {/* Можно заменить href на твою страницу/якорь с формой */}
                    <a href="#contacts">
                      Оформить заказ / задать вопрос
                    </a>
                  </Button>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Нажмите кнопку, чтобы связаться с нами: расскажем о сроках
                    поставки, уточним наличие на складе и актуальную стоимость
                    с учётом курса.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm md:text-base">
                  Как заказать эту запчасть
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  У нас нет прямой онлайн-оплаты — чтобы подтвердить актуальные
                  условия по этой запчасти:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    напишите нам в WhatsApp / Telegram по контактам в шапке сайта
                  </li>
                  <li>или позвоните по телефону, указанному в шапке</li>
                  <li>
                    укажите{" "}
                    <span className="font-medium text-foreground">
                      название и SKU
                    </span>{" "}
                    этой запчасти
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
