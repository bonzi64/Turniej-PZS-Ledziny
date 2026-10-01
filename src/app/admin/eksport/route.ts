import { teamsForReview } from "@/lib/admin-queries";
import { currentStaff } from "@/lib/auth/session";
import { GAMES } from "@/lib/games";

export const dynamic = "force-dynamic";

// średnik + BOM, żeby polski Excel otworzył plik bez kombinowania
const cell = (value: string | number | boolean | null) => {
  const text = value === null ? "" : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export async function GET(request: Request) {
  const staff = await currentStaff();
  if (!staff) return new Response("Brak dostępu", { status: 401 });

  const slug = new URL(request.url).searchParams.get("gra");
  const game = GAMES.find((g) => g.slug === slug) ?? GAMES[0];
  const teams = await teamsForReview(game.code);

  const header = ["druzyna", "tag", "status", "slot", "nick", "imie", "nazwisko", "klasa", "kapitan", "rezerwowy", "email_kapitana", "discord_kapitana", "zgloszono"];
  const rows = teams.flatMap((team) =>
    team.players.map((p) => [
      team.name,
      team.tag,
      team.status,
      p.slot + 1,
      p.nickname,
      p.firstName,
      p.lastName,
      p.schoolClass,
      p.isCaptain,
      p.isReserve,
      p.isCaptain ? team.captainEmail : "",
      p.isCaptain ? team.captainDiscord : "",
      team.createdAt.toISOString(),
    ]),
  );

  const csv = "﻿" + [header, ...rows].map((row) => row.map(cell).join(";")).join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zgloszenia-${game.slug}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
