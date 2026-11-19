import Image from "next/image";
import Link from "next/link";
import { deletePhoto, updatePhotoCaption } from "@/actions/admin-photos";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { dateTime } from "@/components/admin/bits";
import { Group, Window } from "@/components/hx/frame";
import { requireStaff } from "@/lib/auth/session";
import { PHOTO, photoUrl } from "@/lib/photo-limits";
import { listPhotosForStaff } from "@/lib/photos";

export const metadata = { title: "Zdjęcia" };

const kb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

export default async function AdminPhotos() {
  await requireStaff();
  const photos = await listPhotosForStaff();

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <Window title={`Zdjęcia z turnieju (${photos.length})`}>
        {photos.length === 0 ? (
          <p className="ui-inset px-3 py-4 text-ui-muted">
            Brak zdjęć. Publiczna strona{" "}
            <Link href="/zdjecia" className="text-gold underline">
              /zdjecia
            </Link>{" "}
            pokazuje teraz: „Zdjęcia pojawią się po zakończeniu turnieju.”
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {photos.map((photo, i) => (
              <li key={photo.id} className="ui-card space-y-1.5 p-1.5">
                <a href={photoUrl(photo.id)} target="_blank" rel="noreferrer" className="block">
                  <Image
                    unoptimized
                    src={photoUrl(photo.id, "thumb")}
                    width={photo.thumbWidth}
                    height={photo.thumbHeight}
                    alt={photo.caption ?? `Zdjęcie ${i + 1}`}
                    className="ui-inset aspect-4/3 w-full object-cover"
                  />
                </a>
                <ActionForm action={updatePhotoCaption} className="flex flex-wrap gap-1">
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input
                    name="caption"
                    defaultValue={photo.caption ?? ""}
                    maxLength={PHOTO.captionMax}
                    placeholder="Podpis (opcjonalnie)"
                    aria-label={`Podpis zdjęcia ${i + 1}`}
                    className="ui-field min-w-0 flex-1"
                  />
                  <Submit>Zapisz</Submit>
                </ActionForm>
                <div className="flex flex-wrap items-center justify-between gap-1 text-[12px] text-ui-muted">
                  <span>
                    #{i + 1} · {photo.uploadedBy} · {dateTime.format(photo.createdAt)} · {kb(photo.size)}
                  </span>
                  <ActionForm action={deletePhoto} quiet>
                    <input type="hidden" name="photoId" value={photo.id} />
                    <Submit tone="danger" confirm="Usunąć zdjęcie?">
                      Usuń
                    </Submit>
                  </ActionForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Window>

      <div className="space-y-4">
        <Window title="Dodaj zdjęcia">
          <PhotoUploader count={photos.length} />
        </Window>
        <Group legend="Zanim dodasz" className="text-[13px] text-ui-muted">
          <p>Publikuj tylko zdjęcia osób, które mają zgodę szkoły na publikację wizerunku.</p>
          <p className="mt-2">Jeśli ktoś poprosi o usunięcie zdjęcia ze swoim wizerunkiem, kliknij przy nim „Usuń”.</p>
        </Group>
      </div>
    </div>
  );
}
