import type { Game } from "@/generated/prisma/enums";

export type GameSlug = "lol";

export type GameModule = {
  slug: GameSlug;
  code: Game;
  name: string;
  short: string;
  mode: string[];
  blurb: string;
  nickLabel: string;
  nickPlaceholder: string;
};

export const GAMES: readonly GameModule[] = [
  {
    slug: "lol",
    code: "LOL",
    name: "League of Legends",
    short: "LoL",
    mode: ["5v5", "Summoner's Rift", "Tournament Draft", "Wszystkie mecze BO1"],
    blurb: "Summoner's Rift, draft i makro. Bany i picki robicie w kliencie gry, a my pilnujemy drabinki.",
    nickLabel: "Riot ID",
    nickPlaceholder: "nick#EUNE",
  },
];

// turniej obejmuje jedną grę – wybraną w głosowaniu i zmienioną po odwołaniu turnieju CS2
export const GAME = GAMES[0];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);

export function gameByCode(code: Game) {
  const found = GAMES.find((g) => g.code === code);
  if (!found) throw new Error(`Nieznana gra: ${code}`);
  return found;
}
