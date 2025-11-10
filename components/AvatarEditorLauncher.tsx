"use client";
import { useState } from "react";
import AvatarEditorDialog from "./AvatarEditorDialog";

export default function AvatarEditorLauncher({ currentUrl }: { currentUrl?: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label="Сменить фото"
          onClick={() => setOpen(true)}
          className="
            group relative inline-block rounded-full cursor-pointer
            h-32 w-32 md:h-36 md:w-36
            ring-1 ring-border/50 overflow-hidden
            focus:outline-none focus:ring-2 focus:ring-primary/50
          "
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Аватар"
              className="
                h-full w-full object-cover
                transition-transform duration-300
                md:group-hover:scale-105
              "
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}

          <div
            className="
              absolute inset-0
              flex items-center justify-center text-center
              px-3
              text-[13px] font-medium leading-tight
              text-white
              bg-black/40
              opacity-100 md:opacity-0 md:group-hover:opacity-100
              transition-opacity duration-200
            "
          >
            Сменить фото
          </div>
        </button>

        <span className="text-xs text-muted-foreground">PNG/JPG до 2&nbsp;МБ</span>
      </div>

      <AvatarEditorDialog open={open} onOpenChangeAction={setOpen} currentUrl={currentUrl} />
    </>
  );
}
