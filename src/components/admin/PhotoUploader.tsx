"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadPhoto } from "@/actions/admin-photos";
import { PHOTO } from "@/lib/photo-limits";

type Line = { name: string; state: "wait" | "work" | "ok" | "error"; note?: string };

const MARK: Record<Line["state"], string> = { wait: "·", work: "…", ok: "✓", error: "✕" };
const TONE: Record<Line["state"], string> = { wait: "text-vg-faint", work: "text-vg-gold", ok: "text-vg-green", error: "text-[#ff9f8a]" };

// Ponowne zakodowanie przez canvas: obraca zdjęcie według EXIF, zmniejsza i wycina metadane (np. GPS z telefonu)
async function encode(bitmap: ImageBitmap, edge: number, quality: number) {
  const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#fff"; // przezroczyste PNG nie zrobią się czarne
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) throw new Error("encode");
  return { blob, width, height };
}

export function PhotoUploader({ count }: { count: number }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState(0);
  const [caption, setCaption] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);

  const room = Math.max(0, PHOTO.limit - count);

  const send = async () => {
    const files = Array.from(input.current?.files ?? []);
    if (files.length === 0 || busy) return;
    setBusy(true);
    setLines(files.map((file) => ({ name: file.name, state: "wait" })));
    const mark = (index: number, patch: Partial<Line>) => setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));

    for (const [index, file] of files.entries()) {
      mark(index, { state: "work" });
      let bitmap: ImageBitmap | null = null;
      try {
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        const full = await encode(bitmap, PHOTO.maxEdge, PHOTO.quality);
        const thumb = await encode(bitmap, PHOTO.thumbEdge, PHOTO.thumbQuality);
        if (full.blob.size > PHOTO.maxBytes) throw new Error("size");

        const form = new FormData();
        form.set("full", full.blob, "full.jpg");
        form.set("thumb", thumb.blob, "thumb.jpg");
        form.set("width", String(full.width));
        form.set("height", String(full.height));
        form.set("thumbWidth", String(thumb.width));
        form.set("thumbHeight", String(thumb.height));
        form.set("caption", caption);

        const result = await uploadPhoto(form);
        mark(index, result.ok ? { state: "ok" } : { state: "error", note: result.message });
      } catch {
        mark(index, { state: "error", note: "Nie udało się odczytać pliku – użyj JPG lub PNG." });
      } finally {
        bitmap?.close();
      }
    }

    if (input.current) input.current.value = "";
    setPicked(0);
    setBusy(false);
    router.refresh();
  };

  const finished = lines.filter((l) => l.state === "ok" || l.state === "error").length;

  return (
    <div className="space-y-3">
      <div>
        <span className="vg-label">Pliki ({room} wolnych miejsc z {PHOTO.limit})</span>
        <label className="vg-btn w-full" data-sfx="">
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy}
            onChange={(e) => setPicked(e.currentTarget.files?.length ?? 0)}
            className="sr-only"
          />
          {picked ? `Wybrano: ${picked}` : "Wybierz zdjęcia..."}
        </label>
      </div>

      <div>
        <label className="vg-label" htmlFor="photo-caption">
          Podpis (opcjonalnie, dla wszystkich wybranych)
        </label>
        <input id="photo-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={PHOTO.captionMax} disabled={busy} className="vg-field" placeholder="np. Finał: Psi Patrol vs ..." />
      </div>

      <button type="button" data-sfx="" data-tone="gold" disabled={!picked || busy} onClick={send} className="vg-btn min-h-8 w-full">
        {busy ? `Wysyłanie ${finished}/${lines.length}...` : picked ? `Dodaj zdjęcia (${picked})` : "Dodaj zdjęcia"}
      </button>

      {lines.length > 0 && (
        <ul className="vg-deep vg-scroll max-h-56 space-y-0.5 overflow-y-auto px-2 py-1.5 text-[11px]" aria-live="polite">
          {lines.map((line, i) => (
            <li key={`${line.name}-${i}`} className="flex gap-1.5">
              <span className={`w-3 shrink-0 ${TONE[line.state]}`}>{MARK[line.state]}</span>
              <span className="min-w-0">
                <span className="block truncate">{line.name}</span>
                {line.note && <span className="text-[#ff9f8a]">{line.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[11px] text-vg-muted">
        Zdjęcia są zmniejszane w przeglądarce do {PHOTO.maxEdge} px. Dane z aparatu, np. lokalizacja GPS, są usuwane przed wysłaniem.
      </p>
    </div>
  );
}
