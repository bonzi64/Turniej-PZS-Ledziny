import Link from "next/link";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { CameraGlyph } from "@/components/vgui/pixel";
import { Window } from "@/components/vgui/Window";
import { EVENT } from "@/content/event";
import { listPhotos } from "@/lib/photos";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Zdjęcia z turnieju",
  description: `Zdjęcia z ${EVENT.title} ${EVENT.edition} – ${EVENT.school}.`,
  path: "/zdjecia",
});

export default async function PhotosPage() {
  const photos = await listPhotos();

  return (
    <Window
      title="Zdjęcia z turnieju"
      closeHref="/"
      status={
        <>
          <span>{photos.length > 0 ? `Zdjęć: ${photos.length}` : "Galeria pusta"}</span>
          <span>
            {EVENT.title} {EVENT.edition}
          </span>
        </>
      }
    >
      {photos.length === 0 ? (
        <div className="vg-deep flex flex-col items-center px-4 py-14 text-center">
          <CameraGlyph className="text-vg-gold drop-shadow-[0_0_8px_rgb(196_181_80/0.35)]" />
          <p className="mt-5 text-[16px] font-bold text-balance text-vg-gold text-emboss">Zdjęcia pojawią się po zakończeniu turnieju.</p>
          <p className="mt-1.5 text-[12px] text-vg-muted">
            Turniej: {EVENT.dateLabel} ({EVENT.weekday}), {EVENT.schoolShort}.
          </p>
          <Link href="/cs2" data-sfx="" className="vg-btn mt-5 min-w-40">
            Wróć do turnieju
          </Link>
        </div>
      ) : (
        <>
          <PhotoGallery photos={photos} />
          <p className="mt-3 text-[11px] text-vg-faint">
            Zdjęcia publikujemy na podstawie zgód na publikację wizerunku zbieranych przez szkołę. Prośby o usunięcie zdjęcia:{" "}
            <a href={`mailto:${EVENT.contactEmail}`} className="underline hover:text-vg-gold">
              {EVENT.contactEmail}
            </a>
            .
          </p>
        </>
      )}
    </Window>
  );
}
