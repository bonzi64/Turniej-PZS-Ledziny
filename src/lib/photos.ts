import "server-only";
import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

// lista nigdy nie pobiera samych plików – tylko wymiary i podpis
const PUBLIC_PHOTO = {
  id: true,
  caption: true,
  width: true,
  height: true,
  thumbWidth: true,
  thumbHeight: true,
} satisfies Prisma.PhotoSelect;

export type PublicPhoto = Prisma.PhotoGetPayload<{ select: typeof PUBLIC_PHOTO }>;

export async function listPhotos(): Promise<PublicPhoto[]> {
  await connection();
  return db.photo.findMany({ select: PUBLIC_PHOTO, orderBy: { createdAt: "asc" } });
}

export async function listPhotosForStaff() {
  return db.photo.findMany({
    select: { ...PUBLIC_PHOTO, size: true, uploadedBy: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function photoBytes(id: string, size: "full" | "thumb") {
  if (size === "thumb") {
    const row = await db.photo.findUnique({ where: { id }, select: { thumb: true } });
    return row?.thumb ?? null;
  }
  const row = await db.photo.findUnique({ where: { id }, select: { data: true } });
  return row?.data ?? null;
}
