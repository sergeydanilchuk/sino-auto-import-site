type Props = { params: { id: string } };

export default function PartDetailsPage({ params }: Props) {
  const { id } = params;
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Деталь #{id}</h1>
      <p className="text-muted-foreground mt-2">Карточка детали будет позже.</p>
    </div>
  );
}
