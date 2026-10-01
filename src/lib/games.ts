import type { Game } from "@/generated/prisma/enums";

export type GameSlug = "cs2";

export type GameModule = {
  slug: GameSlug;
  code: Game;
  no: string;
  name: string;
  short: string;
  accent: string;
  onAccent: string;
  mode: string[];
  blurb: string;
  nickLabel: string;
  nickPlaceholder: string;
  vetoEnabled: boolean;
};

export const GAMES: readonly GameModule[] = [
  {
    slug: "cs2",
    code: "CS2",
    no: "01",
    name: "Counter-Strike 2",
    short: "CS2",
    accent: "#ffae00",
    onAccent: "#0b0b0e",
    mode: ["5v5", "MR12", "BO1 / finał BO3", "Map veto online"],
    blurb: "Bomba, ekonomia i zero miejsca na błąd. Mapy wybieracie w panelu veto na żywo – jak na FACEIT.",
    nickLabel: "Nick Steam",
    nickPlaceholder: "np. zeus_z_3ti",
    vetoEnabled: true,
  },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);

export function gameByCode(code: Game) {
  const found = GAMES.find((g) => g.code === code);
  if (!found) throw new Error(`Nieznana gra: ${code}`);
  return found;
}
