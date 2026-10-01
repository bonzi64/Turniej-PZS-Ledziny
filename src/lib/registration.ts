import "server-only";
import { z } from "zod";
import { EVENT } from "@/content/event";
import { seal, unseal } from "@/lib/crypto";
import { env } from "@/lib/env";
import type { GameSlug } from "@/lib/games";
import { CLASS_PATTERN, MAIN_ROSTER, RESERVE_SLOT } from "@/lib/tournament";

// --- BILET REGULAMINU ---
// Wydawany przy renderze strony; formularz przejdzie dopiero po RULES_MIN_SECONDS

const TICKET_MAX_AGE = 12 * 3600;

export const issueRulesTicket = (slug: GameSlug) => seal(`rules:${slug}:${Date.now()}`);

export function readRulesTicket(ticket: string, slug: GameSlug) {
  const payload = unseal(ticket);
  const [kind, game, issued] = payload?.split(":") ?? [];
  if (kind !== "rules" || game !== slug) return { valid: false as const };

  const seconds = Math.floor((Date.now() - Number(issued)) / 1000);
  if (!Number.isFinite(seconds) || seconds > TICKET_MAX_AGE) return { valid: false as const };
  return { valid: true as const, seconds, enough: seconds >= env.rulesMinSeconds };
}

export function registrationWindow() {
  if (!env.registrationOpen) return { open: false, reason: "Zapisy zostały wstrzymane przez organizatora." };
  if (Date.now() > Date.parse(EVENT.registrationClosesAt)) {
    return { open: false, reason: `Zapisy zamknięto ${EVENT.registrationClosesLabel}.` };
  }
  return { open: true, reason: null };
}

// --- SCHEMATY ---

const PERSON_NAME = /^\p{L}[\p{L}' -]*\p{L}$/u;
const NICK = /^[\p{L}\p{N} _.#\-|[\]()!?*@]+$/u;

const clean = (v: string) => v.trim().replace(/\s+/g, " ");

const personName = (label: string) =>
  z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(2, `${label}: za krótkie`)
        .max(40, `${label}: maks. 40 znaków`)
        .regex(PERSON_NAME, `${label}: tylko litery, spacja lub myślnik`),
    );

const playerSchema = z.object({
  nick: z
    .string()
    .transform(clean)
    .pipe(z.string().min(2, "Nick: min. 2 znaki").max(32, "Nick: maks. 32 znaki").regex(NICK, "Nick zawiera niedozwolone znaki")),
  first: personName("Imię"),
  last: personName("Nazwisko"),
  class: z
    .string()
    .transform((v) => v.toUpperCase().replace(/\s+/g, ""))
    .pipe(z.string().regex(CLASS_PATTERN, "Klasa, np. 2TI")),
});

const teamSchema = z.object({
  teamName: z
    .string()
    .transform(clean)
    .pipe(z.string().min(3, "Nazwa drużyny: min. 3 znaki").max(28, "Nazwa drużyny: maks. 28 znaków").regex(NICK, "Nazwa zawiera niedozwolone znaki")),
  teamTag: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .pipe(z.union([z.literal(""), z.string().regex(/^[A-Z0-9]{2,5}$/, "Tag: 2–5 liter lub cyfr")])),
  captainEmail: z
    .string()
    .transform((v) => v.trim().toLowerCase())
    .pipe(z.email("Podaj poprawny adres e-mail").max(120)),
  captainDiscord: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.union([z.literal(""), z.string().regex(/^[a-z0-9_.]{2,32}$/i, "Discord: 2–32 znaki (litery, cyfry, _ .)")])),
  captainSlot: z.coerce.number().int().min(0).max(MAIN_ROSTER - 1),
});

export type RosterEntry = {
  slot: number;
  nickname: string;
  firstName: string;
  lastName: string;
  schoolClass: string;
  isCaptain: boolean;
  isReserve: boolean;
};

export type ParsedRegistration = {
  teamName: string;
  teamTag: string | null;
  captainEmail: string;
  captainDiscord: string | null;
  roster: RosterEntry[];
};

export type FieldErrors = Record<string, string>;

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

export function parseRegistration(form: FormData): { data: ParsedRegistration; errors: null } | { data: null; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const team = teamSchema.safeParse({
    teamName: text(form, "teamName"),
    teamTag: text(form, "teamTag"),
    captainEmail: text(form, "captainEmail"),
    captainDiscord: text(form, "captainDiscord"),
    captainSlot: text(form, "captainSlot") || "0",
  });
  if (!team.success) {
    for (const issue of team.error.issues) errors[String(issue.path[0])] ??= issue.message;
  }

  const roster: RosterEntry[] = [];
  for (let slot = 0; slot <= RESERVE_SLOT; slot++) {
    const raw = {
      nick: text(form, `p${slot}.nick`),
      first: text(form, `p${slot}.first`),
      last: text(form, `p${slot}.last`),
      class: text(form, `p${slot}.class`),
    };

    const isReserve = slot === RESERVE_SLOT;
    if (isReserve && Object.values(raw).every((v) => !v.trim())) continue;

    const parsed = playerSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) errors[`p${slot}.${String(issue.path[0])}`] ??= issue.message;
      continue;
    }

    roster.push({
      slot,
      nickname: parsed.data.nick,
      firstName: parsed.data.first,
      lastName: parsed.data.last,
      schoolClass: parsed.data.class,
      isCaptain: team.success && team.data.captainSlot === slot,
      isReserve,
    });
  }

  const seenNick = new Map<string, number>();
  const seenPerson = new Map<string, number>();
  for (const player of roster) {
    const nickKey = player.nickname.toLowerCase();
    const personKey = personKeyOf(player);
    if (seenNick.has(nickKey)) errors[`p${player.slot}.nick`] = "Ten nick już jest w składzie";
    if (seenPerson.has(personKey)) errors[`p${player.slot}.last`] = "Ta osoba już jest w składzie";
    seenNick.set(nickKey, player.slot);
    seenPerson.set(personKey, player.slot);
  }

  if (text(form, "acceptRules") !== "on") errors.acceptRules = "Wymagana akceptacja regulaminu";
  if (text(form, "acceptPrivacy") !== "on") errors.acceptPrivacy = "Wymagana zgoda na przetwarzanie danych";
  if (text(form, "guardianConsent") !== "on") errors.guardianConsent = "Wymagane oświadczenie";

  if (Object.keys(errors).length > 0 || !team.success) return { data: null, errors };

  return {
    data: {
      teamName: team.data.teamName,
      teamTag: team.data.teamTag || null,
      captainEmail: team.data.captainEmail,
      captainDiscord: team.data.captainDiscord || null,
      roster,
    },
    errors: null,
  };
}

export const personKeyOf = (p: { firstName: string; lastName: string; schoolClass: string }) =>
  `${p.firstName}|${p.lastName}|${p.schoolClass}`.toLocaleLowerCase("pl");
