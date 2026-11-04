"use client";

import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { Emblem } from "@/components/vgui/pixel";
import { photoUrl } from "@/lib/photo-limits";

export type GalleryPhoto = { id: string; caption: string | null; width: number; height: number; thumbWidth: number; thumbHeight: number };

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const photo = index === null ? null : photos[index];

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  const close = () => dialog.current?.close();

  const onKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              data-sfx="tick"
              onClick={() => open(i)}
              aria-label={p.caption ? `Otwórz zdjęcie: ${p.caption}` : `Otwórz zdjęcie ${i + 1}`}
              className="vg-panel flex h-full w-full flex-col justify-start p-1 text-left hover:bg-[#56644d]"
            >
              <Image
                unoptimized
                src={photoUrl(p.id, "thumb")}
                width={p.thumbWidth}
                height={p.thumbHeight}
                alt=""
                loading={i < 8 ? "eager" : "lazy"}
                className="vg-deep aspect-4/3 w-full object-cover"
              />
              {p.caption && <span className="mt-1 block truncate px-0.5 text-[12px]">{p.caption}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Podgląd zdjęcia"
        onClose={() => setIndex(null)}
        onKeyDown={onKey}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="vg-lightbox vg-window m-auto w-[min(96vw,1100px)] max-w-none p-0 text-vg-text"
      >
        {photo && index !== null && (
          <>
            <div className="vg-titlebar">
              <Emblem className="text-vg-gold" />
              <span className="min-w-0 truncate">{photo.caption ?? "Zdjęcie z turnieju"}</span>
              <span className="ml-auto pl-2 text-[11px] font-normal text-vg-muted tabular">
                {index + 1} / {photos.length}
              </span>
              <button type="button" data-sfx="" onClick={close} aria-label="Zamknij podgląd" className="vg-btn size-4.5 min-h-0 p-0 text-[11px] leading-none font-bold">
                ✕
              </button>
            </div>
            <div className="px-2 pb-2 sm:px-3 sm:pb-3">
              <div className="vg-deep flex items-center justify-center p-1">
                <Image
                  key={photo.id}
                  unoptimized
                  src={photoUrl(photo.id)}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.caption ?? `Zdjęcie ${index + 1} z turnieju`}
                  className="h-auto max-h-[74dvh] w-auto max-w-full"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button type="button" data-sfx="tick" onClick={() => step(-1)} disabled={photos.length < 2} className="vg-btn min-w-24">
                    ◄ Poprzednie
                  </button>
                  <button type="button" data-sfx="tick" onClick={() => step(1)} disabled={photos.length < 2} className="vg-btn min-w-24">
                    Następne ►
                  </button>
                </div>
                <a href={photoUrl(photo.id)} target="_blank" rel="noreferrer" className="text-[12px] text-vg-muted underline hover:text-vg-gold">
                  Otwórz w pełnym rozmiarze
                </a>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
