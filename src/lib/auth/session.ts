import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { StaffRole } from "@/generated/prisma/enums";
import { randomToken, sha256 } from "@/lib/crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const STAFF_COOKIE = "pzs_sid";
const SESSION_HOURS = 12;

export async function openSession(staffId: string) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3_600_000);

  await db.session.create({ data: { id: sha256(token), staffId, expiresAt } });
  await db.session.deleteMany({ where: { staffId, expiresAt: { lt: new Date() } } });

  const jar = await cookies();
  jar.set(STAFF_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.secureCookies,
    path: "/",
    expires: expiresAt,
  });
}

export async function closeSession() {
  const jar = await cookies();
  const token = jar.get(STAFF_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { id: sha256(token) } });
  jar.delete(STAFF_COOKIE);
}

export const currentStaff = cache(async () => {
  const token = (await cookies()).get(STAFF_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { id: sha256(token) },
    select: {
      expiresAt: true,
      staff: { select: { id: true, login: true, displayName: true, role: true } },
    },
  });

  if (!session || session.expiresAt <= new Date()) return null;
  return session.staff;
});

export type StaffIdentity = NonNullable<Awaited<ReturnType<typeof currentStaff>>>;

export async function requireStaff(role?: StaffRole): Promise<StaffIdentity> {
  const staff = await currentStaff();
  if (!staff) redirect("/admin/login");
  if (role === "ADMIN" && staff.role !== "ADMIN") redirect("/admin");
  return staff;
}
