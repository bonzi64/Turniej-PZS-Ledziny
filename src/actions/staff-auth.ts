"use server";

import { redirect } from "next/navigation";
import { type ActionResult, fail } from "@/lib/action-result";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { closeSession, openSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { forgive, throttle } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export async function signIn(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const login = String(form.get("login") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!login || !password) return fail("Podaj login i hasło.");

  const key = `login:${await clientIp()}`;
  const gate = await throttle(key, 8, 900);
  if (!gate.ok) return fail(`Za dużo nieudanych prób. Odczekaj ${Math.ceil(gate.retryIn / 60)} min.`);

  const staff = await db.staff.findUnique({ where: { login } });

  // wyrównanie czasu odpowiedzi, żeby nie zdradzać istnienia loginu
  const valid = staff ? await verifyPassword(password, staff.passwordHash) : (await hashPassword(password), false);
  if (!staff || !valid) return fail("Nieprawidłowy login lub hasło.");

  await forgive(key);
  await db.staff.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
  await openSession(staff.id);
  redirect("/admin");
}

export async function signOut() {
  await closeSession();
  redirect("/admin/login");
}
