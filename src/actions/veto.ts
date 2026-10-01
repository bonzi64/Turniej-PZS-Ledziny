"use server";

import { type ActionResult, done, fail } from "@/lib/action-result";
import { sameString } from "@/lib/crypto";
import { forgive, throttle } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { grantCaptain, loadVetoMatch, markReady, type MoveOutcome, playMove, revokeCaptain } from "@/lib/veto/service";

export async function enterCaptainPin(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const matchId = String(form.get("matchId") ?? "");
  const pin = String(form.get("pin") ?? "").replace(/\D/g, "");
  if (pin.length !== 6) return fail("PIN ma 6 cyfr.");

  const key = `pin:${await clientIp()}:${matchId}`;
  const gate = await throttle(key, 8, 600);
  if (!gate.ok) return fail(`Za dużo prób. Odczekaj ${Math.ceil(gate.retryIn / 60)} min.`);

  const match = await loadVetoMatch(matchId);
  if (!match) return fail("Nie znaleziono meczu.");
  if (!match.pinA || !match.pinB) return fail("Organizator nie wydał jeszcze PIN-ów.");
  if (match.vetoDoneAt) return fail("Veto tego meczu jest już zakończone.");

  const side = sameString(pin, match.pinA) ? "A" : sameString(pin, match.pinB) ? "B" : null;
  if (!side) return fail("Nieprawidłowy PIN.");

  await forgive(key);
  await grantCaptain(match.id, side, pin);
  await markReady(match, side);
  return done("Jesteś w pokoju jako kapitan.");
}

export async function banOrPick(matchId: string, mapId: string): Promise<MoveOutcome> {
  if (typeof matchId !== "string" || typeof mapId !== "string") return { ok: false, message: "Błędne dane." };
  return playMove(matchId, mapId);
}

export async function leaveCaptainSeat(matchId: string) {
  if (typeof matchId === "string") await revokeCaptain(matchId);
}
