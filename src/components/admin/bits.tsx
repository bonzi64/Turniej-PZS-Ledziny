import Link from "next/link";
import type { TeamStatus } from "@/generated/prisma/enums";
import { Tag } from "@/components/vgui/Window";
import type { GameModule } from "@/lib/games";

export const dateTime = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Warsaw",
});

export function pickGame(raw: string | string[] | undefined, games: readonly GameModule[]): GameModule {
  const slug = Array.isArray(raw) ? raw[0] : raw;
  return games.find((g) => g.slug === slug) ?? games[0];
}

export function GameTabs({ base, active, games }: { base: string; active: GameModule; games: readonly GameModule[] }) {
  if (games.length < 2) return null;
  return (
    <nav className="vg-tabs mb-[-1px] px-0" aria-label="Gra">
      {games.map((g) => (
        <Link key={g.slug} href={`${base}?gra=${g.slug}`} data-sfx="" aria-selected={g.slug === active.slug} className="vg-tab">
          {g.name}
        </Link>
      ))}
    </nav>
  );
}

const STATUS: Record<TeamStatus, { label: string; tone: "gold" | "green" | "red" }> = {
  PENDING: { label: "Oczekuje", tone: "gold" },
  APPROVED: { label: "Zatwierdzone", tone: "green" },
  REJECTED: { label: "Odrzucone", tone: "red" },
};

export function StatusBadge({ status }: { status: TeamStatus }) {
  return <Tag tone={STATUS[status].tone}>{STATUS[status].label}</Tag>;
}
