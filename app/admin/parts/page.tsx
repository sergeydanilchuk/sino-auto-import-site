export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import AddPartDialog from "./AddPartDialog";
import PartsList from "./PartsList";

export default function AdminPartsPage() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Запчасти</h1>
        <AddPartDialog />
      </div>

      <p className="text-muted-foreground">
        Управление каталогом запчастей.
      </p>

      <PartsList />
    </div>
  );
}
