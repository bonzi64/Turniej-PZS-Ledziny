"use client";

import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { ChevronIcon } from "@/components/hx/icons";
import { useSlotStat } from "@/components/hx/live";
import { Avatar } from "@/components/skin/parts";
import type { PublicTeam, SlotStat } from "@/lib/queries";

// Panel „znajomych” z klienta: szkoła jako przywoływacz, a pod nią zawsze 8 miejsc turnieju –
// zatwierdzone drużyny jako grupy ze składem, zgłoszenia w weryfikacji i wolne sloty
export function SocialPanel({ teams, initial, signupOpen }: { teams: PublicTeam[]; initial: SlotStat[]; signupOpen: boolean }) {
  const stat = useSlotStat(initial);
  const full = stat.taken >= stat.max;
  const pending = Math.max(0, Math.min(stat.pending, stat.max - teams.length));
  const free = Math.max(0, stat.max - teams.length - pending);
  const status = !signupOpen ? { label: "Zapisy zamknięte", tone: "bg-ruby" } : full ? { label: "Komplet drużyn", tone: "bg-brass" } : { label: "Zapisy otwarte", tone: "bg-emerald" };

  return (
    <aside aria-label="Drużyny turnieju" className="sticky top-20 hidden h-[calc(100dvh-5rem)] w-[300px] shrink-0 flex-col border-l border-hull bg-void/92 xl:flex">
      <div className="flex items-center gap-3 border-b border-hull px-4 py-4">
        <span className="hx-ring size-12">
          <SchoolLogo height={32} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold text-parchment">PZS Lędziny</p>
          <p className="flex items-center gap-1.5 text-[14px] text-ui-muted">
            <span className={`hx-dot ${status.tone}`} />
            {status.label}
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between px-4 pt-4 pb-2">
        <p className="font-display text-[16px] tracking-[0.05em] text-gold">Drużyny</p>
        <p className="hx-digits text-[17px]">
          {stat.taken}
          <span className="text-ui-muted">/{stat.max}</span>
        </p>
      </div>

      <ol className="ui-scroll flex-1 overflow-y-auto px-1.5 pb-4">
        {teams.map((team) => (
          <li key={team.id}>
            <details open className="group">
              <summary
                data-sfx="tick"
                className="flex list-none items-center gap-2 px-3 py-2 text-[12px] font-bold tracking-[0.14em] text-ui-muted uppercase transition-colors hover:text-parchment [&::-webkit-details-marker]:hidden"
              >
                <ChevronIcon size={12} className="transition-transform duration-200 group-open:rotate-90" />
                <span className="min-w-0 truncate">{team.name}</span>
                <span className="ml-auto font-normal tabular">{team.roster.length}</span>
              </summary>
              <ul className="pb-1">
                {team.roster.map((player, i) => (
                  <li key={`${player.nickname}-${i}`} className="ui-row flex items-center gap-2.5 px-3 py-1.5">
                    <span className="relative">
                      <Avatar seed={player.nickname} size={30} />
                      <span className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-void ${player.reserve ? "bg-steel" : "bg-emerald"}`} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] leading-tight text-parchment" title={player.nickname}>
                        {player.nickname}
                      </p>
                      <p className={`truncate text-[13px] ${player.captain ? "text-gold" : "text-ui-muted"}`}>
                        {player.captain ? "Kapitan" : player.reserve ? "Rezerwa" : "W składzie"} · {player.schoolClass}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}

        {Array.from({ length: pending }, (_, i) => (
          <li key={`pending-${i}`} className="flex items-center gap-2.5 px-3 py-1.5">
            <span className="relative grid size-[30px] place-items-center rounded-full border border-brass/70 bg-navy">
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-void bg-brass" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] leading-tight text-parchment">W weryfikacji</p>
              <p className="text-[13px] text-ui-muted">Miejsce {teams.length + i + 1} · czeka na organizatora</p>
            </div>
          </li>
        ))}

        {Array.from({ length: free }, (_, i) => (
          <li key={`free-${i}`} className="flex items-center gap-2.5 px-3 py-1.5">
            <span className="size-[30px] shrink-0 rounded-full border border-dashed border-bronze" />
            <div className="min-w-0">
              <p className="text-[15px] leading-tight text-ui-muted">Wolny slot {teams.length + pending + i + 1}</p>
              <p className="text-[13px] text-ui-faint">{signupOpen ? "czeka na drużynę" : "zapisy zamknięte"}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
