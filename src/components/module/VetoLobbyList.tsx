import Link from "next/link";
import { Identicon } from "@/components/vgui/pixel";
import { MapTile } from "@/components/veto/MapTile";
import { Group, Tag } from "@/components/vgui/Window";
import type { BracketMatch } from "@/lib/queries";
import { matchLabel } from "@/lib/tournament";
import { ACTIVE_DUTY, MAP_POOL_STAMP, mapById } from "@/lib/veto/maps";

const STAGE = {
  off: { label: "Czeka na PIN-y", tone: "dark" },
  lobby: { label: "Lobby", tone: undefined },
  live: { label: "Na żywo", tone: "red" },
  done: { label: "Zakończone", tone: "green" },
} as const;

export function VetoLobbyList({ rounds }: { rounds: BracketMatch[][] }) {
  const matches = rounds.flat().filter((m) => m.id && m.teamA && m.teamB);

  return (
    <div className="space-y-6">
      <Group legend={`Pula map · ${MAP_POOL_STAMP}`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {ACTIVE_DUTY.map((map) => (
            <MapTile key={map.id} map={map} />
          ))}
        </div>
      </Group>

      <Group legend="Pokoje veto">
        {matches.length === 0 ? (
          <p className="text-vg-muted">Pokoje pojawią się, gdy organizator rozstawi drabinkę i wyda PIN-y kapitanom.</p>
        ) : (
          <ul className="space-y-1.5">
            {matches.map((match) => {
              const stage = STAGE[match.veto];
              const maps = match.picks.map((p) => mapById(p.map)?.name ?? p.map);
              return (
                <li key={match.id} className="vg-deep grid grid-cols-1 items-center gap-2 px-3 py-2 text-[12px] sm:grid-cols-[8rem_minmax(0,1fr)_auto_auto]">
                  <span className="text-vg-muted">
                    {matchLabel(match.round, match.slot)} · {match.format}
                  </span>
                  <span className="flex min-w-0 items-center gap-2">
                    <Identicon seed={match.teamA?.name ?? "A"} size={16} />
                    <span className="truncate font-bold">{match.teamA?.name}</span>
                    <span className="text-vg-faint">vs</span>
                    <Identicon seed={match.teamB?.name ?? "B"} size={16} />
                    <span className="truncate font-bold">{match.teamB?.name}</span>
                    {maps.length > 0 && <span className="hidden truncate text-vg-muted md:inline">· {maps.join(", ")}</span>}
                  </span>
                  <Tag tone={stage.tone}>{stage.label}</Tag>
                  <Link href={`/cs2/veto/${match.id}`} data-sfx="" className="vg-btn">
                    Dołącz
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Group>
    </div>
  );
}
