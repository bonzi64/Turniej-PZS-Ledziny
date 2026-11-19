import Link from "next/link";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { PageHead } from "@/components/hx/frame";
import { CameraIcon } from "@/components/hx/icons";
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
    <>
      <PageHead title="Zdjęcia" aside={photos.length > 0 ? <p className="text-[14px] text-ui-muted tabular">Zdjęć: {photos.length}</p> : undefined}>
        {EVENT.title} {EVENT.edition}, {EVENT.weekday} {EVENT.dateLabel}.
      </PageHead>

      {photos.length === 0 ? (
        <div className="hx-frame flex flex-col items-center px-6 py-16 text-center" data-rule="">
          <span className="hx-ring size-24">
            <CameraIcon size={34} className="text-gold" />
          </span>
          <p className="mt-6 font-display text-[26px] tracking-[0.04em] text-parchment text-balance">Zdjęcia pojawią się po turnieju</p>
          <p className="mt-2 text-[15px] text-ui-muted">
            Turniej: {EVENT.weekday} {EVENT.dateLabel}, {EVENT.schoolShort}.
          </p>
          <Link href="/" data-sfx="" className="ui-btn mt-7 min-w-48">
            Wróć do turnieju
          </Link>
        </div>
      ) : (
        <>
          <PhotoGallery photos={photos} />
          <p className="mt-4 text-[13px] text-ui-faint">
            Zdjęcia publikujemy na podstawie zgód na publikację wizerunku zbieranych przez szkołę. Prośby o usunięcie zdjęcia:{" "}
            <a href={`mailto:${EVENT.contactEmail}`} className="underline hover:text-gold">
              {EVENT.contactEmail}
            </a>
            .
          </p>
        </>
      )}
    </>
  );
}
