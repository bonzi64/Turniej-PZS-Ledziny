"use client";

import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { ArrowOutIcon, ChevronIcon, CloseIcon } from "@/components/hx/icons";
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
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              data-sfx="tick"
              onClick={() => open(i)}
              aria-label={p.caption ? `Otwórz zdjęcie: ${p.caption}` : `Otwórz zdjęcie ${i + 1}`}
              className="group hx-frame flex h-full w-full flex-col justify-start p-1.5 text-left transition-[filter] hover:brightness-125"
            >
              <Image
                unoptimized
                src={photoUrl(p.id, "thumb")}
                width={p.thumbWidth}
                height={p.thumbHeight}
                alt=""
                loading={i < 8 ? "eager" : "lazy"}
                className="aspect-4/3 w-full bg-void object-cover"
              />
              {p.caption && <span className="mt-1.5 block truncate px-1 pb-0.5 text-[13px] text-ui-muted group-hover:text-parchment">{p.caption}</span>}
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
        className="hx-lightbox hx-frame m-auto w-[min(96vw,1100px)] max-w-none p-0 text-parchment"
      >
        {photo && index !== null && (
          <>
            <div className="flex items-center gap-3 px-4 pt-3 pb-2.5">
              <span className="hx-head min-w-0 truncate text-[17px]">{photo.caption ?? "Zdjęcie z turnieju"}</span>
              <span className="ml-auto pl-2 text-[13px] text-ui-muted tabular">
                {index + 1} / {photos.length}
              </span>
              <button type="button" data-sfx="" onClick={close} aria-label="Zamknij podgląd" className="hx-icon-btn size-8">
                <CloseIcon size={14} />
              </button>
            </div>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="flex items-center justify-center border border-hull bg-void p-1">
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
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button type="button" data-sfx="tick" onClick={() => step(-1)} disabled={photos.length < 2} data-size="sm" className="ui-btn min-w-32">
                    <ChevronIcon dir="left" size={14} />
                    Poprzednie
                  </button>
                  <button type="button" data-sfx="tick" onClick={() => step(1)} disabled={photos.length < 2} data-size="sm" className="ui-btn min-w-32">
                    Następne
                    <ChevronIcon size={14} />
                  </button>
                </div>
                <a href={photoUrl(photo.id)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-ui-muted underline hover:text-gold">
                  Otwórz w pełnym rozmiarze
                  <ArrowOutIcon size={12} />
                </a>
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
