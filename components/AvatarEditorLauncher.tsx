"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AvatarEditorDialog from "./AvatarEditorDialog";

export default function AvatarEditorLauncher({ currentUrl }: { currentUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-3">
        {currentUrl && <img src={currentUrl} alt="" className="h-10 w-10 rounded-full object-cover" />}
        <Button type="button" onClick={() => setOpen(true)}>Сменить фото</Button>
      </div>
      <AvatarEditorDialog open={open} onOpenChangeAction={setOpen} currentUrl={currentUrl} />
    </>
  );
}
