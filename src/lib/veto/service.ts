import "server-only";
import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Match, VetoStep } from "@/generated/prisma/client";
import type { MatchFormat, Side, VetoAction } from "@/generated/prisma/enums";
import { seal, sha256, unseal } from "@/lib/crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { matchLabel } from "@/lib/tournament";
import { ACTIVE_DUTY, mapById } from "@/lib/veto/maps";
import { turnAt, VETO_ORDER, type VetoPhase, type VetoTurn } from "@/lib/veto/sequence";

// --- TYPY ---

type MatchWithSteps = Match & { vetoSteps: VetoStep[] };

export type VetoTeam = { name: string; tag: string | null; classes: string[] };

export type VetoStepView = {
  order: number;
  map: string;
  action: VetoAction;
  side: Side | null;
  auto: boolean;
};

export type VetoSnapshot = {
  matchId: string;
  label: string;
  format: MatchFormat;
  phase: VetoPhase;
  teams: Record<Side, VetoTeam | null>;
  ready: Record<Side, boolean>;
  steps: VetoStepView[];
  turn: (VetoTurn & { order: number; endsAt: string | null }) | null;
  turnSeconds: number;
  viewer: Side | null;
  serverNow: string;
};

export type MoveOutcome = { ok: true } | { ok: false; message: string };

class MoveRejected extends Error {}

// --- CIASTECZKO KAPITANA ---

const captainCookie = (matchId: string) => `pzs_cap_${matchId}`;

// zmiana PIN-u przez organizatora unieważnia stare ciasteczka
const pinPrint = (pin: string) => sha256(`veto-pin:${pin}`).slice(0, 16);

export async function grantCaptain(matchId: string, side: Side, pin: string) {
  const jar = await cookies();
  jar.set(captainCookie(matchId), seal(`${matchId}:${side}:${pinPrint(pin)}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.secureCookies,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function revokeCaptain(matchId: string) {
  (await cookies()).delete(captainCookie(matchId));
}

export async function captainSide(match: Pick<Match, "id" | "pinA" | "pinB">): Promise<Side | null> {
  const payload = unseal((await cookies()).get(captainCookie(match.id))?.value);
  if (!payload) return null;

  const [id, side, print] = payload.split(":");
  if (id !== match.id) return null;

  const pin = side === "A" ? match.pinA : side === "B" ? match.pinB : null;
  return pin && print === pinPrint(pin) ? (side as Side) : null;
}

// --- STAN ---

export const loadVetoMatch = (matchId: string) =>
  db.match.findFirst({
    where: { id: matchId, game: "CS2" },
    include: { vetoSteps: { orderBy: { order: "asc" } } },
  });

export function phaseOf(match: Match): VetoPhase {
  if (match.vetoDoneAt) return "DONE";
  if (!match.teamAId || !match.teamBId || !match.pinA || !match.pinB) return "LOCKED";
  if (!match.readyA || !match.readyB) return "LOBBY";
  return "LIVE";
}

const freeMaps = (match: MatchWithSteps) => {
  const used = new Set(match.vetoSteps.map((s) => s.map));
  return ACTIVE_DUTY.filter((m) => !used.has(m.id));
};

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function commitMove(
  matchId: string,
  order: number,
  mapId: string,
  opts: { side?: Side; auto?: boolean; at?: Date } = {},
): Promise<MoveOutcome> {
  try {
    await db.$transaction(async (tx) => {
      const match = await tx.match.findUnique({ where: { id: matchId }, include: { vetoSteps: true } });
      if (!match || phaseOf(match) !== "LIVE") throw new MoveRejected("Veto nie jest teraz aktywne.");
      if (match.vetoSteps.length !== order) throw new MoveRejected("Stan veto się zmienił – spróbuj ponownie.");

      const turn = turnAt(match.format, order);
      if (!turn) throw new MoveRejected("Wszystkie ruchy zostały wykonane.");
      if (opts.side && opts.side !== turn.side) throw new MoveRejected("To nie jest tura Twojej drużyny.");

      const used = new Set(match.vetoSteps.map((s) => s.map));
      if (!mapById(mapId) || used.has(mapId)) throw new MoveRejected("Ta mapa nie jest już dostępna.");

      const at = opts.at ?? new Date();
      await tx.vetoStep.create({
        data: { matchId, order, map: mapId, action: turn.action, side: turn.side, auto: Boolean(opts.auto), createdAt: at },
      });
      used.add(mapId);

      if (order + 1 < VETO_ORDER[match.format].length) {
        await tx.match.update({ where: { id: matchId }, data: { turnStartedAt: at } });
        return;
      }

      const decider = ACTIVE_DUTY.find((m) => !used.has(m.id));
      if (!decider) throw new Error("Pula map nie pasuje do sekwencji veto");
      await tx.vetoStep.create({
        data: { matchId, order: order + 1, map: decider.id, action: "DECIDER", side: null, createdAt: at },
      });
      await tx.match.update({ where: { id: matchId }, data: { vetoDoneAt: at, turnStartedAt: null } });
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof MoveRejected) return { ok: false, message: error.message };
    if (isUniqueViolation(error)) return { ok: false, message: "Ktoś był szybszy – stan został odświeżony." };
    throw error;
  }
}

// Leniwe rozliczanie timeoutów: bez crona, przy każdym odczycie stanu
async function settleTimeouts(match: MatchWithSteps): Promise<MatchWithSteps> {
  const limit = env.vetoTurnSeconds;
  let current = match;

  for (let guard = 0; limit > 0 && guard < VETO_ORDER.BO3.length; guard++) {
    if (phaseOf(current) !== "LIVE" || !current.turnStartedAt) break;
    if (!turnAt(current.format, current.vetoSteps.length)) break;

    const deadline = current.turnStartedAt.getTime() + limit * 1000;
    if (Date.now() < deadline) break;

    const pool = freeMaps(current);
    await commitMove(current.id, current.vetoSteps.length, pool[randomInt(0, pool.length)].id, {
      auto: true,
      at: new Date(deadline),
    });

    const reloaded = await loadVetoMatch(current.id);
    if (!reloaded) break;
    current = reloaded;
  }

  return current;
}

export async function buildSnapshot(matchId: string): Promise<VetoSnapshot | null> {
  await connection();
  const loaded = await loadVetoMatch(matchId);
  if (!loaded) return null;

  const match = await settleTimeouts(loaded);
  const teamIds = [match.teamAId, match.teamBId].filter((id): id is string => Boolean(id));
  const teams = await db.team.findMany({
    where: { id: { in: teamIds } },
    select: { id: true, name: true, tag: true, players: { select: { schoolClass: true, isReserve: true } } },
  });

  const teamView = (id: string | null): VetoTeam | null => {
    const team = teams.find((t) => t.id === id);
    if (!team) return null;
    const classes = [...new Set(team.players.filter((p) => !p.isReserve).map((p) => p.schoolClass))].sort();
    return { name: team.name, tag: team.tag, classes };
  };

  const phase = phaseOf(match);
  const order = match.vetoSteps.length;
  const turn = phase === "LIVE" ? turnAt(match.format, order) : null;
  const limit = env.vetoTurnSeconds;

  return {
    matchId: match.id,
    label: matchLabel(match.round, match.slot),
    format: match.format,
    phase,
    teams: { A: teamView(match.teamAId), B: teamView(match.teamBId) },
    ready: { A: Boolean(match.readyA), B: Boolean(match.readyB) },
    steps: match.vetoSteps.map((s) => ({ order: s.order, map: s.map, action: s.action, side: s.side, auto: s.auto })),
    turn: turn
      ? {
          ...turn,
          order,
          endsAt:
            limit > 0 && match.turnStartedAt ? new Date(match.turnStartedAt.getTime() + limit * 1000).toISOString() : null,
        }
      : null,
    turnSeconds: limit,
    viewer: await captainSide(match),
    serverNow: new Date().toISOString(),
  };
}

// --- RUCHY ---

export async function markReady(match: Match, side: Side) {
  const now = new Date();
  if (side === "A") {
    await db.match.updateMany({ where: { id: match.id, readyA: null }, data: { readyA: now } });
  } else {
    await db.match.updateMany({ where: { id: match.id, readyB: null }, data: { readyB: now } });
  }

  // start zegara dopiero, gdy obaj kapitanowie są w pokoju
  await db.match.updateMany({
    where: { id: match.id, readyA: { not: null }, readyB: { not: null }, turnStartedAt: null, vetoDoneAt: null },
    data: { turnStartedAt: now },
  });
}

export async function playMove(matchId: string, mapId: string): Promise<MoveOutcome> {
  const loaded = await loadVetoMatch(matchId);
  if (!loaded) return { ok: false, message: "Nie znaleziono meczu." };

  const side = await captainSide(loaded);
  if (!side) return { ok: false, message: "Sesja kapitana wygasła – wpisz PIN ponownie." };

  const match = await settleTimeouts(loaded);
  return commitMove(match.id, match.vetoSteps.length, mapId, { side });
}
