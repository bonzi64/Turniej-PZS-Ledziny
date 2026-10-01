"use server";

import { revalidatePath } from "next/cache";
import type { Game, Side } from "@/generated/prisma/enums";
import { type ActionResult, done, explain, fail, UserFacingError } from "@/lib/action-result";
import { requireStaff } from "@/lib/auth/session";
import { clearResult, ensureBracket, placeTeam, recordResult, shuffleSeeds, updateSchedule } from "@/lib/bracket";
import { makePin } from "@/lib/crypto";
import { db } from "@/lib/db";
import { GAMES, gameByCode } from "@/lib/games";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

function refresh(game: Game, matchId?: string) {
  const slug = gameByCode(game).slug;
  revalidatePath("/admin/drabinka");
  revalidatePath(`/${slug}`);
  if (matchId) revalidatePath(`/cs2/veto/${matchId}`);
}

async function matchFrom(form: FormData) {
  const match = await db.match.findUnique({ where: { id: text(form, "matchId") } });
  if (!match) throw new UserFacingError("Nie znaleziono meczu.");
  return match;
}

export async function prepareBracket(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  const game = GAMES.find((g) => g.code === text(form, "game"));
  if (!game) return fail("Nieznana gra.");
  await ensureBracket(game.code);
  refresh(game.code);
  return done("Drabinka gotowa.");
}

export async function randomizeSeeds(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  const game = GAMES.find((g) => g.code === text(form, "game"));
  if (!game) return fail("Nieznana gra.");
  try {
    const seeded = await shuffleSeeds(game.code);
    refresh(game.code);
    return done(`Rozlosowano ${seeded} drużyn.`);
  } catch (error) {
    return explain(error);
  }
}

export async function seatTeam(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);
    const side = text(form, "side") as Side;
    if (side !== "A" && side !== "B") return fail("Błędna strona.");
    await placeTeam(match.id, side, text(form, "teamId") || null);
    refresh(match.game, match.id);
    return done("Zapisano rozstawienie.");
  } catch (error) {
    return explain(error);
  }
}

export async function saveResult(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);
    const scoreA = Number.parseInt(text(form, "scoreA"), 10);
    const scoreB = Number.parseInt(text(form, "scoreB"), 10);
    if (![scoreA, scoreB].every((s) => Number.isInteger(s) && s >= 0 && s <= 99)) return fail("Wynik: liczby 0–99.");
    await recordResult(match.id, scoreA, scoreB);
    refresh(match.game, match.id);
    return done("Wynik zapisany, zwycięzca awansował.");
  } catch (error) {
    return explain(error);
  }
}

export async function wipeResult(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);
    await clearResult(match.id);
    refresh(match.game, match.id);
    return done("Wynik wyczyszczony.");
  } catch (error) {
    return explain(error);
  }
}

export async function saveSchedule(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);

    // datetime-local nie niesie strefy – turniej jest w Polsce, grudzień = CET
    const raw = text(form, "startsAt");
    const startsAt = raw ? new Date(`${raw}:00+01:00`) : null;
    if (startsAt && Number.isNaN(startsAt.getTime())) return fail("Błędna godzina.");

    await updateSchedule(match.id, startsAt);
    refresh(match.game, match.id);
    return done("Zapisano godzinę meczu.");
  } catch (error) {
    return explain(error);
  }
}

export async function issuePins(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);
    if (match.game !== "CS2") return fail("Veto map działa tylko w CS2.");
    if (!match.teamAId || !match.teamBId) return fail("Najpierw ustaw obie drużyny.");
    if (match.vetoDoneAt) return fail("Veto jest zakończone – zresetuj je, aby wydać nowe PIN-y.");

    const pinA = makePin();
    let pinB = makePin();
    while (pinB === pinA) pinB = makePin();

    await db.$transaction([
      db.vetoStep.deleteMany({ where: { matchId: match.id } }),
      db.match.update({
        where: { id: match.id },
        data: { pinA, pinB, readyA: null, readyB: null, turnStartedAt: null, vetoDoneAt: null },
      }),
    ]);
    refresh(match.game, match.id);
    return done("Nowe PIN-y wydane. Poprzednie sesje kapitanów wygasły.");
  } catch (error) {
    return explain(error);
  }
}

export async function resetVeto(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff();
  try {
    const match = await matchFrom(form);
    await db.$transaction([
      db.vetoStep.deleteMany({ where: { matchId: match.id } }),
      db.match.update({
        where: { id: match.id },
        data: { readyA: null, readyB: null, turnStartedAt: null, vetoDoneAt: null },
      }),
    ]);
    refresh(match.game, match.id);
    return done("Veto zresetowane – kapitanowie muszą ponownie wpisać PIN.");
  } catch (error) {
    return explain(error);
  }
}
