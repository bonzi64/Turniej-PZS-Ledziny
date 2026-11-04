"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, done, explain, fail } from "@/lib/action-result";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PHOTO } from "@/lib/photo-limits";

const JPEG_MAGIC = [0xff, 0xd8, 0xff];

async function readJpeg(form: FormData, key: string, maxBytes: number) {
  const file = form.get(key);
  if (!(file instanceof File) || file.size === 0 || file.size > maxBytes) return null;
  const bytes = new Uint8Array(await file.arrayBuffer());
  return JPEG_MAGIC.every((b, i) => bytes[i] === b) ? bytes : null;
}

function dimension(form: FormData, key: string) {
  const value = Number(form.get(key));
  return Number.isInteger(value) && value > 0 && value <= PHOTO.maxEdge ? value : null;
}

const caption = (form: FormData) => String(form.get("caption") ?? "").trim().replace(/\s+/g, " ").slice(0, PHOTO.captionMax) || null;
const photoId = (form: FormData) => String(form.get("photoId") ?? "");

function refresh() {
  revalidatePath("/zdjecia");
  revalidatePath("/admin/zdjecia");
}

// wywoływane z przeglądarki po kolei dla każdego zdjęcia – plik jest już zmniejszony do JPEG
export async function uploadPhoto(form: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  try {
    const data = await readJpeg(form, "full", PHOTO.maxBytes);
    const thumb = await readJpeg(form, "thumb", PHOTO.maxThumbBytes);
    const width = dimension(form, "width");
    const height = dimension(form, "height");
    const thumbWidth = dimension(form, "thumbWidth");
    const thumbHeight = dimension(form, "thumbHeight");
    if (!data || !thumb || !width || !height || !thumbWidth || !thumbHeight) {
      return fail("Nieprawidłowy plik – wybierz zdjęcie JPG lub PNG.");
    }

    if ((await db.photo.count()) >= PHOTO.limit) return fail(`Limit ${PHOTO.limit} zdjęć – usuń starsze, żeby dodać nowe.`);

    await db.photo.create({
      data: { caption: caption(form), width, height, thumbWidth, thumbHeight, size: data.byteLength, data, thumb, uploadedBy: staff.displayName },
    });
    refresh();
    return done("Dodano zdjęcie.");
  } catch (error) {
    return explain(error);
  }
}

export async function updatePhotoCaption(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const { count } = await db.photo.updateMany({ where: { id: photoId(form) }, data: { caption: caption(form) } });
    if (count === 0) return fail("Zdjęcie już nie istnieje.");
    refresh();
    return done("Zapisano podpis.");
  } catch (error) {
    return explain(error);
  }
}

export async function deletePhoto(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const { count } = await db.photo.deleteMany({ where: { id: photoId(form) } });
    if (count === 0) return fail("Zdjęcie już nie istnieje.");
    refresh();
    return done("Usunięto zdjęcie.");
  } catch (error) {
    return explain(error);
  }
}
