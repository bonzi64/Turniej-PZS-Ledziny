import "server-only";
import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import type { Game, MatchFormat, Side, TeamStatus, VetoAction } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { GAMES, type GameSlug } from "@/lib/games";
import { MAX_TEAMS, ROUNDS } from "@/lib/tournament";

// --- GRANICA RODO ---
// Wszystko, co wychodzi z tego pliku, trafia na publiczne strony:
// tylko nazwa drużyny, tag, nicki i klasy. Imiona, nazwiska i kontakt – wyłącznie w /admin.

const PUBLIC_TEAM = {
  id: true,
  name: true,
  tag: true,
  players: {
    select: { nickname: true, schoolClass: true, isCaptain: true, isReserve: true },
    orderBy: { slot: "asc" },
  },
} satisfies Prisma.TeamSelect;

type PublicTeamRow = Prisma.TeamGetPayload<{ select: typeof PUBLIC_TEAM }>;

export type PublicPlayer = {
  nickname: string;
  schoolClass: string;
  captain: boolean;
  reserve: boolean;
};

export type PublicTeam = {
  id: string;
  name: string;
  tag: string | null;
  classes: string[];
  roster: PublicPlayer[];
};

export type SlotStat = {
  slug: GameSlug;
  taken: number;
  approved: number;
  pending: number;
  max: number;
};

function toPublicTeam(row: PublicTeamRow): PublicTeam {
  const roster = row.players.map((p) => ({
    nickname: p.nickname,
    schoolClass: p.schoolClass,
    captain: p.isCaptain,
    reserve: p.isReserve,
  }));

  const classes = [...new Set(roster.filter((p) => !p.reserve).map((p) => p.schoolClass))].sort();
  return { id: row.id, name: row.name, tag: row.tag, classes, roster };
}

export async function getSlotStats(): Promise<SlotStat[]> {
  await connection();
  const grouped = await db.team.groupBy({ by: ["game", "status"], _count: { _all: true } });

  return GAMES.map((game) => {
    const count = (status: TeamStatus) =>
      grouped.find((row) => row.game === game.code && row.status === status)?._count._all ?? 0;
    const approved = count("APPROVED");
    const pending = count("PENDING");
    return { slug: game.slug, approved, pending, taken: approved + pending, max: MAX_TEAMS };
  });
}

export async function getPublicTeams(game: Game) {
  await connection();
  const rows = await db.team.findMany({
    where: { game, status: "APPROVED" },
    select: PUBLIC_TEAM,
    orderBy: [{ reviewedAt: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toPublicTeam);
}

// --- DRABINKA ---

export type BracketPick = { map: string; action: VetoAction; side: Side | null };

export type VetoStage = "off" | "lobby" | "live" | "done";

export type BracketMatch = {
  id: string | null;
  round: number;
  slot: number;
  format: MatchFormat;
  startsAt: string | null;
  teamA: PublicTeam | null;
  teamB: PublicTeam | null;
  scoreA: number | null;
  scoreB: number | null;
  winner: Side | null;
  picks: BracketPick[];
  veto: VetoStage;
};

export async function getPublicBracket(game: Game): Promise<BracketMatch[][]> {
  await connection();
  const matches = await db.match.findMany({
    where: { game },
    select: {
      id: true,
      round: true,
      slot: true,
      format: true,
      startsAt: true,
      teamAId: true,
      teamBId: true,
      scoreA: true,
      scoreB: true,
      winnerSide: true,
      pinA: true,
      readyA: true,
      readyB: true,
      vetoDoneAt: true,
      vetoSteps: {
        where: { action: { in: ["PICK", "DECIDER"] } },
        select: { map: true, action: true, side: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const ids = matches.flatMap((m) => [m.teamAId, m.teamBId]).filter((id): id is string => Boolean(id));
  const teams = ids.length
    ? await db.team.findMany({ where: { id: { in: ids } }, select: PUBLIC_TEAM })
    : [];
  const byId = new Map(teams.map((t) => [t.id, toPublicTeam(t)]));

  return ROUNDS.map((meta) =>
    Array.from({ length: meta.matches }, (_, slot): BracketMatch => {
      const row = matches.find((m) => m.round === meta.round && m.slot === slot);
      if (!row) {
        return {
          id: null,
          round: meta.round,
          slot,
          format: "BO1",
          startsAt: null,
          teamA: null,
          teamB: null,
          scoreA: null,
          scoreB: null,
          winner: null,
          picks: [],
          veto: "off",
        };
      }

      // pinA służy tylko do wyliczenia etapu – nie wychodzi poza serwer
      const veto: VetoStage = row.vetoDoneAt
        ? "done"
        : !row.pinA
          ? "off"
          : row.readyA && row.readyB
            ? "live"
            : "lobby";

      return {
        id: row.id,
        round: row.round,
        slot: row.slot,
        format: row.format,
        startsAt: row.startsAt?.toISOString() ?? null,
        teamA: row.teamAId ? (byId.get(row.teamAId) ?? null) : null,
        teamB: row.teamBId ? (byId.get(row.teamBId) ?? null) : null,
        scoreA: row.scoreA,
        scoreB: row.scoreB,
        winner: row.winnerSide,
        picks: row.vetoSteps,
        veto,
      };
    }),
  );
}
