"use server";

import { revalidatePath } from "next/cache";
import type { Game } from "@/generated/prisma/enums";
import { type ActionResult, done, explain, fail, UserFacingError } from "@/lib/action-result";
import { requireStaff } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { GAMES, gameByCode } from "@/lib/games";
import { MAX_TEAMS } from "@/lib/tournament";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

function refresh(game: Game) {
  const slug = gameByCode(game).slug;
  revalidatePath("/admin", "layout");
  revalidatePath(`/${slug}`);
  revalidatePath("/");
}

async function findTeam(form: FormData) {
  const team = await db.team.findUnique({ where: { id: text(form, "teamId") } });
  if (!team) throw new UserFacingError("Zgłoszenie nie istnieje.");
  return team;
}

// drużyna w drabince blokuje zmianę statusu, dopóki organizator jej nie zdejmie
async function releaseFromBracket(teamId: string) {
  const seated = await db.match.findMany({ where: { OR: [{ teamAId: teamId }, { teamBId: teamId }] } });
  if (seated.some((m) => m.winnerSide || m.readyA || m.readyB || m.vetoDoneAt || m.round > 1)) {
    throw new UserFacingError("Drużyna gra już w drabince – najpierw wyczyść jej wyniki i veto.");
  }
  await db.$transaction(
    seated.map((m) =>
      db.match.update({
        where: { id: m.id },
        data: { teamAId: m.teamAId === teamId ? null : m.teamAId, teamBId: m.teamBId === teamId ? null : m.teamBId },
      }),
    ),
  );
}

export async function approveTeam(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  try {
    const team = await findTeam(form);
    if (team.status === "APPROVED") return done("Już zatwierdzone.");
    if (team.anonymizedAt) return fail("Zgłoszenie zostało zanonimizowane.");

    const approved = await db.team.count({ where: { game: team.game, status: "APPROVED" } });
    if (approved >= MAX_TEAMS) return fail(`Limit ${MAX_TEAMS} zatwierdzonych drużyn osiągnięty.`);

    await db.team.update({
      where: { id: team.id },
      data: { status: "APPROVED", reviewedBy: staff.displayName, reviewedAt: new Date(), reviewNote: null },
    });
    refresh(team.game);
    return done(`Zatwierdzono: ${team.name}`);
  } catch (error) {
    return explain(error);
  }
}

export async function rejectTeam(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  try {
    const team = await findTeam(form);
    await releaseFromBracket(team.id);
    await db.team.update({
      where: { id: team.id },
      data: {
        status: "REJECTED",
        reviewedBy: staff.displayName,
        reviewedAt: new Date(),
        reviewNote: text(form, "note").slice(0, 300) || null,
      },
    });
    refresh(team.game);
    return done(`Odrzucono: ${team.name}`);
  } catch (error) {
    return explain(error);
  }
}

export async function reopenTeam(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const staff = await requireStaff();
  try {
    const team = await findTeam(form);
    if (team.status !== "REJECTED") await releaseFromBracket(team.id);

    const active = await db.team.count({ where: { game: team.game, status: { not: "REJECTED" }, id: { not: team.id } } });
    if (team.status === "REJECTED" && active >= MAX_TEAMS) return fail("Brak wolnych slotów – nie można przywrócić.");

    await db.team.update({
      where: { id: team.id },
      data: { status: "PENDING", reviewedBy: staff.displayName, reviewedAt: new Date() },
    });
    refresh(team.game);
    return done(`Cofnięto do weryfikacji: ${team.name}`);
  } catch (error) {
    return explain(error);
  }
}

export async function deleteTeam(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff("ADMIN");
  try {
    const team = await findTeam(form);
    await releaseFromBracket(team.id);
    await db.team.delete({ where: { id: team.id } });
    refresh(team.game);
    return done(`Usunięto zgłoszenie: ${team.name}`);
  } catch (error) {
    return explain(error);
  }
}

export async function anonymizeGame(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireStaff("ADMIN");
  const game = GAMES.find((g) => g.code === text(form, "game"));
  if (!game) return fail("Wybierz grę.");
  if (text(form, "confirm") !== "ANONIMIZUJ") return fail("Wpisz ANONIMIZUJ, aby potwierdzić.");

  const [players, teams] = await db.$transaction([
    db.player.updateMany({
      where: { team: { game: game.code } },
      data: { firstName: "[usunięto]", lastName: "[usunięto]" },
    }),
    db.team.updateMany({
      where: { game: game.code, anonymizedAt: null },
      data: { captainEmail: "usunieto@anonim.invalid", captainDiscord: null, anonymizedAt: new Date() },
    }),
  ]);

  refresh(game.code);
  return done(`${game.short}: zanonimizowano ${teams.count} drużyn / ${players.count} zawodników.`);
}
