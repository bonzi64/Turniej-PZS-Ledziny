"use server";

import { revalidatePath } from "next/cache";
import { UserFacingError } from "@/lib/action-result";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { gameBySlug } from "@/lib/games";
import { throttle } from "@/lib/rate-limit";
import { type FieldErrors, parseRegistration, personKeyOf, readRulesTicket, registrationWindow } from "@/lib/registration";
import { clientIp } from "@/lib/request";
import { MAX_TEAMS } from "@/lib/tournament";

export type RegisterState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: FieldErrors; at: number }
  | { status: "ok"; teamName: string };

class RosterConflict extends UserFacingError {
  constructor(
    message: string,
    readonly fields: FieldErrors,
  ) {
    super(message);
  }
}

const field = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

const reject = (message: string, fields?: FieldErrors): RegisterState => ({ status: "error", message, fields, at: Date.now() });

export async function registerTeam(_prev: RegisterState, form: FormData): Promise<RegisterState> {
  const game = gameBySlug(field(form, "game"));
  if (!game) return reject("Ta gra nie bierze udziału w turnieju.");

  const window = registrationWindow();
  if (!window.open) return reject(window.reason ?? "Zapisy są zamknięte.");

  // honeypot – boty dostają fałszywy sukces
  if (field(form, "website")) return { status: "ok", teamName: field(form, "teamName") };

  const ticket = readRulesTicket(field(form, "ticket"), game.slug);
  if (!ticket.valid) return reject("Formularz wygasł. Odśwież stronę i przeczytaj regulamin jeszcze raz.");
  if (!ticket.enough) return reject(`Regulamin trzeba czytać co najmniej ${env.rulesMinSeconds} s.`);

  const parsed = parseRegistration(form);
  if (!parsed.data) return reject("Popraw zaznaczone pola.", parsed.errors);
  const entry = parsed.data;

  const gate = await throttle(`register:${await clientIp()}`, 5, 3600);
  if (!gate.ok) return reject(`Za dużo zgłoszeń z tego urządzenia. Spróbuj za ${Math.ceil(gate.retryIn / 60)} min.`);

  try {
    await db.$transaction(async (tx) => {
      const active = await tx.team.findMany({
        where: { game: game.code, status: { not: "REJECTED" } },
        select: {
          name: true,
          players: { select: { nickname: true, firstName: true, lastName: true, schoolClass: true } },
        },
      });

      if (active.length >= MAX_TEAMS) throw new UserFacingError("Komplet – wszystkie sloty w tej grze są już zajęte.");

      const conflicts: FieldErrors = {};
      if (active.some((t) => t.name.toLocaleLowerCase("pl") === entry.teamName.toLocaleLowerCase("pl"))) {
        conflicts.teamName = "Drużyna o tej nazwie jest już zgłoszona";
      }

      for (const player of entry.roster) {
        for (const team of active) {
          const clash = team.players.find(
            (p) => p.nickname.toLowerCase() === player.nickname.toLowerCase() || personKeyOf(p) === personKeyOf(player),
          );
          if (clash) conflicts[`p${player.slot}.nick`] = `Ten zawodnik gra już w drużynie ${team.name}`;
        }
      }

      if (Object.keys(conflicts).length > 0) throw new RosterConflict("Część składu jest już zgłoszona.", conflicts);

      await tx.team.create({
        data: {
          game: game.code,
          name: entry.teamName,
          tag: entry.teamTag,
          captainEmail: entry.captainEmail,
          captainDiscord: entry.captainDiscord,
          rulesSeconds: ticket.seconds,
          consentAt: new Date(),
          players: { create: entry.roster },
        },
      });
    });
  } catch (error) {
    if (error instanceof RosterConflict) return reject(error.message, error.fields);
    if (error instanceof UserFacingError) return reject(error.message);
    throw error;
  }

  revalidatePath(`/${game.slug}`);
  revalidatePath("/");
  return { status: "ok", teamName: entry.teamName };
}
