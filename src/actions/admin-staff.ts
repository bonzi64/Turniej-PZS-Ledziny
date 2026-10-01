"use server";

import { revalidatePath } from "next/cache";
import type { StaffRole } from "@/generated/prisma/enums";
import { type ActionResult, done, fail } from "@/lib/action-result";
import { hashPassword, PASSWORD_MIN, verifyPassword } from "@/lib/auth/password";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

const LOGIN = /^[a-z0-9._-]{3,32}$/;

export async function createStaff(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff("ADMIN");

  const login = text(form, "login").toLowerCase();
  const displayName = text(form, "displayName");
  const password = String(form.get("password") ?? "");
  const role: StaffRole = text(form, "role") === "ADMIN" ? "ADMIN" : "ORGANIZER";

  if (!LOGIN.test(login)) return fail("Login: 3–32 znaki, małe litery, cyfry, . _ -");
  if (displayName.length < 3) return fail("Podaj imię i nazwisko nauczyciela.");
  if (password.length < PASSWORD_MIN) return fail(`Hasło: min. ${PASSWORD_MIN} znaków.`);
  if (await db.staff.findUnique({ where: { login } })) return fail("Taki login już istnieje.");

  await db.staff.create({ data: { login, displayName, role, passwordHash: await hashPassword(password) } });
  revalidatePath("/admin/konta");
  return done(`Utworzono konto: ${login}`);
}

export async function removeStaff(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const me = await requireStaff("ADMIN");
  const target = await db.staff.findUnique({ where: { id: text(form, "staffId") } });
  if (!target) return fail("Konto nie istnieje.");
  if (target.id === me.id) return fail("Nie możesz usunąć własnego konta.");

  if (target.role === "ADMIN" && (await db.staff.count({ where: { role: "ADMIN" } })) <= 1) {
    return fail("Musi zostać co najmniej jeden administrator.");
  }

  await db.staff.delete({ where: { id: target.id } });
  revalidatePath("/admin/konta");
  return done(`Usunięto konto: ${target.login}`);
}

export async function resetStaffPassword(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff("ADMIN");
  const password = String(form.get("password") ?? "");
  if (password.length < PASSWORD_MIN) return fail(`Hasło: min. ${PASSWORD_MIN} znaków.`);

  const target = await db.staff.findUnique({ where: { id: text(form, "staffId") } });
  if (!target) return fail("Konto nie istnieje.");

  await db.$transaction([
    db.staff.update({ where: { id: target.id }, data: { passwordHash: await hashPassword(password) } }),
    db.session.deleteMany({ where: { staffId: target.id } }),
  ]);
  return done(`Nowe hasło ustawione dla: ${target.login}`);
}

export async function changeOwnPassword(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const me = await requireStaff();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const repeat = String(form.get("repeat") ?? "");

  if (next.length < PASSWORD_MIN) return fail(`Nowe hasło: min. ${PASSWORD_MIN} znaków.`);
  if (next !== repeat) return fail("Hasła nie są identyczne.");

  const account = await db.staff.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await verifyPassword(current, account.passwordHash))) return fail("Obecne hasło jest nieprawidłowe.");

  await db.staff.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  return done("Hasło zmienione.");
}
