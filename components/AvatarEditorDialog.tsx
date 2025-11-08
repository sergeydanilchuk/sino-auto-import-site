"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/useMe";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChangeAction: (v: boolean) => void;
  currentUrl?: string | null;
};

type Size = { width: number; height: number };

export default function AvatarEditorDialog({
  open,
  onOpenChangeAction,
  currentUrl,
}: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [ownedUrl, setOwnedUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(0); // для Progress

  const [cropBoxPx, setCropBoxPx] = useState<number>(450);
  const [cropSizePx, setCropSizePx] = useState<number>(430);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { mutate } = useMe();
  const router = useRouter();

  // натуральный размер изображения для корректного превью
  const [imgSize, setImgSize] = useState<Size | null>(null);
  useEffect(() => {
    if (!imageSrc) {
      setImgSize(null);
      return;
    }
    const img = new Image();
    img.onload = () =>
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = imageSrc;
  }, [imageSrc]);

  // адаптивный контейнер кропера
  useEffect(() => {
    if (!previewRef.current) return;
    const el = previewRef.current;
    const ro = new ResizeObserver(() => {
      const box = Math.floor(Math.min(el.clientWidth, el.clientHeight));
      if (box > 0) {
        const circle = Math.floor(box * 0.95);
        setCropBoxPx(box);
        setCropSizePx(circle);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // грузим текущий аватар как исходник
  useEffect(() => {
    let cancelled = false;
    async function loadCurrent() {
      if (!open || imageSrc || !currentUrl) return;
      try {
        const res = await fetch(currentUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (cancelled) return;
        setImageSrc(url);
        setOwnedUrl(url);
      } catch {}
    }
    loadCurrent();
    return () => {
      cancelled = true;
    };
  }, [open, currentUrl, imageSrc]);

  // Сброс при закрытии и корректный сброс при повторном открытии
  useEffect(() => {
    if (!open) {
      if (ownedUrl) URL.revokeObjectURL(ownedUrl);
      setImageSrc(null);
      setOwnedUrl(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setMinZoom(1);
      setCroppedAreaPixels(null);
      setImgSize(null);
      // После закрытия состояния сохранения очищены,
      // чтобы при следующем открытии кнопка «Сохранить» не зависала
      setSaving(false);
      setSavingProgress(0);
    } else {
      // при новом открытии точно уберём возможные “хвосты”
      setSaving(false);
      setSavingProgress(0);
    }
  }, [open, ownedUrl]);

  // Сброс позы при новой картинке
  useEffect(() => {
    if (imageSrc) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [imageSrc]);

  useEffect(
    () => () => {
      if (ownedUrl) URL.revokeObjectURL(ownedUrl);
    },
    [ownedUrl]
  );

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (ownedUrl) {
      URL.revokeObjectURL(ownedUrl);
      setOwnedUrl(null);
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(String(reader.result)));
    reader.readAsDataURL(f);
  };

  // --- плавное обновление превью во время перетягивания/зума ---
  const rafIdRef = useRef<number | null>(null);
  const lastAreaPxRef = useRef<any>(null);

  const setAreaSmooth = useCallback((areaPx: any) => {
    lastAreaPxRef.current = areaPx;
    if (rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setCroppedAreaPixels(lastAreaPxRef.current);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const onCropComplete = useCallback((_a: any, areaPx: any) => {
    setCroppedAreaPixels(areaPx);
  }, []);
  // -------------------------------------------------------------

  // минимальный зум
  useEffect(() => {
    if (!imageSrc || !cropSizePx) return;
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const epsilon = (2 * dpr) / cropSizePx;
    const safe = 1 + epsilon;
    setMinZoom(safe);
    setZoom(safe);
    setCrop({ x: 0, y: 0 });
  }, [imageSrc, cropSizePx]);

  // ---- LIVE превью ---
  const makePreviewStyle = useCallback(
    (previewSize: number, fallbackUrl?: string | null): React.CSSProperties => {
      const url = imageSrc ?? fallbackUrl ?? null;
      if (!url)
        return {
          width: previewSize,
          height: previewSize,
          borderRadius: "9999px",
          background: "transparent",
        };

      if (!imgSize || !croppedAreaPixels) {
        return {
          width: previewSize,
          height: previewSize,
          borderRadius: "9999px",
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        };
      }

      const scale = previewSize / croppedAreaPixels.width;
      const bgW = imgSize.width * scale;
      const bgH = imgSize.height * scale;
      const bgX = -croppedAreaPixels.x * scale;
      const bgY = -croppedAreaPixels.y * scale;

      return {
        width: previewSize,
        height: previewSize,
        borderRadius: "9999px",
        backgroundImage: `url(${url})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${bgW}px ${bgH}px`,
        backgroundPosition: `${bgX}px ${bgY}px`,
        overflow: "hidden",
      };
    },
    [imageSrc, imgSize, croppedAreaPixels]
  );

  const largePreview = useMemo(
    () => <div style={makePreviewStyle(96, currentUrl)} className="rounded-xl" />,
    [makePreviewStyle, currentUrl]
  );

  const miniPreview = useMemo(
    () => <div style={makePreviewStyle(40, currentUrl)} />,
    [makePreviewStyle, currentUrl]
  );
  // ---------------------

  async function getCroppedFile(): Promise<File | null> {
    if (!imageSrc || !croppedAreaPixels) return null;
    const img = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const d = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);
    const { x: sx, y: sy } = croppedAreaPixels;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, d, d, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.9)
    );
    if (!blob) return null;
    return new File([blob], "avatar.jpg", { type: "image/jpeg" });
  }

  async function onSave() {
    setSaving(true);
    try {
      setSavingProgress(10); // подготовка
      const file = await getCroppedFile();
      if (!file) {
        setSaving(false);
        setSavingProgress(0);
        return;
      }

      setSavingProgress(60); // отправка
      const fd = new FormData();
      fd.append("file", file);
      const origin = window.location.origin;
      const r = await fetch(`${origin}/api/account/avatar`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error("upload failed");

      setSavingProgress(85); // обновление состояния клиента
      await mutate();

      setSavingProgress(100);
      toast.success("Аватарка обновлена");

      // закрываем модалку; при закрытии стейт сбросится эффектом
      onOpenChangeAction(false);
      router.replace(`/settings?refresh=1`);
    } catch {
      setSaving(false);
      setSavingProgress(0);
      toast.error("Не удалось сохранить аватар");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Сменить фото</DialogTitle>
          <DialogDescription>
            Превью мини и большого аватара обновляются в реальном времени.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Левая часть: кроппер */}
          <div className="md:col-span-2 flex justify-center">
            <div
              ref={previewRef}
              style={{ width: cropBoxPx, height: cropBoxPx }}
              className="relative rounded-xl overflow-hidden border"
            >
              {imageSrc ? (
                <>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    cropSize={{ width: cropSizePx, height: cropSizePx }}
                    objectFit="cover"
                    minZoom={minZoom}
                    maxZoom={minZoom * 8}
                    zoomWithScroll
                    showGrid={false}
                    restrictPosition
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    onCropAreaChange={(_area, areaPx) => setAreaSmooth(areaPx)}
                  />

                  {/* Ползунок масштабирования */}
                  <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/85 backdrop-blur border shadow px-3 py-2">
                      <ZoomOut className="h-4 w-4 opacity-70" />
                      <input
                        type="range"
                        min={minZoom}
                        max={minZoom * 8}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        aria-label="Масштаб"
                        className="h-2 w-48 appearance-none rounded-full bg-muted/60 
                                   [--thumb:theme(colors.foreground)] 
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--thumb)]
                                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--thumb)]"
                      />
                      <ZoomIn className="h-4 w-4 opacity-70" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                  Выберите изображение
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка: предпросмотры + загрузка */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Превью (большое)</div>
              {largePreview}
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Превью (мини)</div>
              {miniPreview}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelectFile}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer"
              disabled={saving}
            >
              Сменить фото
            </Button>

            {/* Индикатор прогресса сохранения */}
            {saving && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Сохраняю…
                </div>
                <Progress value={savingProgress} />
              </div>
            )}

            <div className="text-xs text-muted-foreground">Размер файла ≤ 2 МБ</div>

            <Button
              type="button"
              onClick={onSave}
              disabled={!imageSrc || saving}
              className="w-full"
            >
              {saving ? "Загрузка…" : "Сохранить"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
