import "server-only";
import type { Match } from "@/generated/prisma/client";
import type { Game, Side } from "@/generated/prisma/enums";
import { UserFacingError } from "@/lib/action-result";
import { shuffled } from "@/lib/crypto";
import { db } from "@/lib/db";
import { FINAL_ROUND, MAX_TEAMS, ROUNDS } from "@/lib/tournament";

// --- STRUKTURA ---

export async function ensureBracket(game: Game) {
  await db.match.createMany({
    data: ROUNDS.flatMap((meta) =>
      Array.from({ length: meta.matches }, (_, slot) => ({
        game,
        round: meta.round,
        slot,
        // turniej musi skończyć się do 14:30 – wszystkie mecze, także finał, w BO1
        format: "BO1",
      })),
    ),
    skipDuplicates: true,
  });
}

// zwycięzca slotu 0/1 trafia do meczu 0 kolejnej rundy (A/B), 2/3 do meczu 1 itd.
function feedOf(match: Pick<Match, "round" | "slot">) {
  if (match.round >= FINAL_ROUND) return null;
  return { round: match.round + 1, slot: Math.floor(match.slot / 2), side: (match.slot % 2 === 0 ? "A" : "B") as Side };
}

const teamOn = (match: Match, side: Side) => (side === "A" ? match.teamAId : match.teamBId);

async function vetoTouched(match: Match) {
  if (match.readyA || match.readyB || match.vetoDoneAt) return true;
  return (await db.vetoStep.count({ where: { matchId: match.id } })) > 0;
}

async function mustFind(matchId: string) {
  const match = await db.match.findUnique({ where: { id: matchId } });
  if (!match) throw new UserFacingError("Nie znaleziono meczu.");
  return match;
}

async function assertEditable(match: Match, what: string) {
  if (match.winnerSide) throw new UserFacingError(`${what}: najpierw wyczyść wynik tego meczu.`);
  if (await vetoTouched(match)) throw new UserFacingError(`${what}: najpierw zresetuj veto tego meczu.`);
}

// --- ROZSTAWIENIE ---

export async function placeTeam(matchId: string, side: Side, teamId: string | null) {
  const match = await mustFind(matchId);
  if (match.round !== 1) throw new UserFacingError("Ręcznie rozstawia się tylko ćwierćfinały – dalej awansują zwycięzcy.");
  await assertEditable(match, "Zmiana drużyny");

  if (teamId) {
    const team = await db.team.findFirst({ where: { id: teamId, game: match.game, status: "APPROVED" } });
    if (!team) throw new UserFacingError("Można rozstawić tylko zatwierdzoną drużynę z tej gry.");

    const elsewhere = await db.match.findMany({
      where: { game: match.game, round: 1, id: { not: match.id }, OR: [{ teamAId: teamId }, { teamBId: teamId }] },
    });
    for (const other of elsewhere) await assertEditable(other, "Drużyna jest już w innym meczu");

    await db.$transaction([
      ...elsewhere.map((other) =>
        db.match.update({
          where: { id: other.id },
          data: { teamAId: other.teamAId === teamId ? null : other.teamAId, teamBId: other.teamBId === teamId ? null : other.teamBId },
        }),
      ),
      db.match.update({ where: { id: match.id }, data: side === "A" ? { teamAId: teamId } : { teamBId: teamId } }),
    ]);
    return;
  }

  await db.match.update({ where: { id: match.id }, data: side === "A" ? { teamAId: null } : { teamBId: null } });
}

export async function shuffleSeeds(game: Game) {
  await ensureBracket(game);
  const firstRound = await db.match.findMany({ where: { game, round: 1 }, orderBy: { slot: "asc" } });
  for (const match of firstRound) await assertEditable(match, "Losowanie");

  const approved = await db.team.findMany({
    where: { game, status: "APPROVED" },
    select: { id: true },
    orderBy: [{ reviewedAt: "asc" }, { createdAt: "asc" }],
    take: MAX_TEAMS,
  });
  if (approved.length < 2) throw new UserFacingError("Do losowania potrzeba co najmniej 2 zatwierdzonych drużyn.");

  const pool = shuffled(approved.map((t) => t.id));
  await db.$transaction(
    firstRound.map((match) =>
      db.match.update({
        where: { id: match.id },
        data: { teamAId: pool[match.slot * 2] ?? null, teamBId: pool[match.slot * 2 + 1] ?? null },
      }),
    ),
  );
  return approved.length;
}

// --- WYNIKI ---

export async function recordResult(matchId: string, scoreA: number, scoreB: number) {
  const match = await mustFind(matchId);
  if (!match.teamAId || !match.teamBId) throw new UserFacingError("Mecz nie ma jeszcze obu drużyn.");
  if (scoreA === scoreB) throw new UserFacingError("W drabince pucharowej nie ma remisów.");

  const winnerSide: Side = scoreA > scoreB ? "A" : "B";
  const winnerId = teamOn(match, winnerSide);
  const feed = feedOf(match);

  if (!feed) {
    await db.match.update({ where: { id: match.id }, data: { scoreA, scoreB, winnerSide } });
    return;
  }

  await ensureBracket(match.game);
  const next = await db.match.findUniqueOrThrow({
    where: { game_round_slot: { game: match.game, round: feed.round, slot: feed.slot } },
  });
  const seated = teamOn(next, feed.side);
  if (seated && seated !== winnerId) await assertEditable(next, "Kolejny mecz już trwa");

  await db.$transaction([
    db.match.update({ where: { id: match.id }, data: { scoreA, scoreB, winnerSide } }),
    db.match.update({ where: { id: next.id }, data: feed.side === "A" ? { teamAId: winnerId } : { teamBId: winnerId } }),
  ]);
}

export async function clearResult(matchId: string) {
  const match = await mustFind(matchId);
  const feed = feedOf(match);
  const winnerId = match.winnerSide ? teamOn(match, match.winnerSide) : null;

  const next = feed
    ? await db.match.findUnique({ where: { game_round_slot: { game: match.game, round: feed.round, slot: feed.slot } } })
    : null;

  if (next && feed && winnerId && teamOn(next, feed.side) === winnerId) {
    await assertEditable(next, "Zwycięzca gra już kolejny mecz");
  }

  await db.$transaction([
    db.match.update({ where: { id: match.id }, data: { scoreA: null, scoreB: null, winnerSide: null } }),
    ...(next && feed && winnerId && teamOn(next, feed.side) === winnerId
      ? [db.match.update({ where: { id: next.id }, data: feed.side === "A" ? { teamAId: null } : { teamBId: null } })]
      : []),
  ]);
}

export async function updateSchedule(matchId: string, startsAt: Date | null) {
  const match = await mustFind(matchId);
  await db.match.update({ where: { id: match.id }, data: { startsAt } });
}
