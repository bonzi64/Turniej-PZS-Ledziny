import "server-only";
import type { Game, TeamStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { GAMES } from "@/lib/games";

// Pełne dane osobowe – importować wyłącznie w /admin za requireStaff()

export async function overview() {
  const [grouped, recent] = await Promise.all([
    db.team.groupBy({ by: ["game", "status"], _count: { _all: true } }),
    db.team.findMany({
      // stare zgłoszenia z usuniętych gier (VALORANT, LOL) pomijamy
      where: { status: "PENDING", game: { in: GAMES.map((g) => g.code) } },
      orderBy: { createdAt: "asc" },
      take: 8,
      select: { id: true, game: true, name: true, tag: true, createdAt: true, captainEmail: true, _count: { select: { players: true } } },
    }),
  ]);

  const counts = GAMES.map((game) => {
    const of = (status: TeamStatus) => grouped.find((g) => g.game === game.code && g.status === status)?._count._all ?? 0;
    return { game, pending: of("PENDING"), approved: of("APPROVED"), rejected: of("REJECTED") };
  });

  return { counts, recent };
}

export function teamsForReview(game: Game, status?: TeamStatus) {
  return db.team.findMany({
    where: { game, ...(status ? { status } : {}) },
    include: { players: { orderBy: { slot: "asc" } } },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });
}

export async function statusCounts(game: Game) {
  const grouped = await db.team.groupBy({ by: ["status"], where: { game }, _count: { _all: true } });
  const of = (status: TeamStatus) => grouped.find((g) => g.status === status)?._count._all ?? 0;
  return { PENDING: of("PENDING"), APPROVED: of("APPROVED"), REJECTED: of("REJECTED") };
}

export async function bracketBoard(game: Game) {
  const [matches, approved] = await Promise.all([
    db.match.findMany({
      where: { game },
      orderBy: [{ round: "asc" }, { slot: "asc" }],
      include: { _count: { select: { vetoSteps: true } } },
    }),
    db.team.findMany({
      where: { game, status: "APPROVED" },
      select: { id: true, name: true, tag: true },
      orderBy: [{ reviewedAt: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const seated = new Set(matches.flatMap((m) => [m.teamAId, m.teamBId]).filter(Boolean));
  const names = new Map(
    (
      await db.team.findMany({
        where: { id: { in: [...seated].filter((id): id is string => Boolean(id)) } },
        select: { id: true, name: true, status: true },
      })
    ).map((t) => [t.id, t]),
  );

  return { matches, approved, seated, names };
}

export function staffList() {
  return db.staff.findMany({
    orderBy: [{ role: "asc" }, { login: "asc" }],
    select: { id: true, login: true, displayName: true, role: true, lastLoginAt: true, createdAt: true },
  });
}
