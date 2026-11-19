import { CrownIcon } from "@/components/hx/icons";
import { TabLink } from "@/components/module/TabLink";
import { Avatar, Chip } from "@/components/skin/parts";
import type { PublicTeam } from "@/lib/queries";

function TeamCard({ team, seat }: { team: PublicTeam; seat: number }) {
  return (
    <article className="hx-frame p-4">
      <header className="flex items-center gap-3.5">
        <span className="hx-ring size-12">
          <Avatar seed={team.name} size={40} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="ui-name truncate text-[17px] leading-tight" title={team.name}>
            {team.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-ui-muted">
            Miejsce {seat}
            {team.tag && ` · [${team.tag}]`}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {team.classes.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </header>
      <div className="hx-divider my-3.5" aria-hidden />

      <ul className="space-y-1">
        {team.roster.map((player, i) => (
          <li key={`${player.nickname}-${i}`} className="ui-row flex items-center gap-3 px-2 py-1.5 text-[14px]">
            <Avatar seed={player.nickname} size={26} />
            <span className="min-w-0 flex-1 truncate text-parchment" title={player.nickname}>
              {player.nickname}
            </span>
            <span className="text-[13px] text-ui-muted tabular">{player.schoolClass}</span>
            <span className="flex w-20 shrink-0 justify-end">
              {player.captain ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.1em] text-gold uppercase">
                  <CrownIcon size={14} />
                  Kapitan
                </span>
              ) : player.reserve ? (
                <Chip tone="dark">Rezerwa</Chip>
              ) : (
                <span className="text-[12px] font-bold tracking-[0.1em] text-sand uppercase">Gracz</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function EmptySlot({ seat, pending }: { seat: number; pending: boolean }) {
  const body = (
    <>
      <span aria-hidden className={`grid size-10 rotate-45 place-items-center border ${pending ? "border-gold" : "border-umber border-dashed"}`}>
        <span className="-rotate-45 font-display text-[15px] text-gold tabular">{seat}</span>
      </span>
      <p className={`mt-4 font-display text-[23px] tracking-[0.02em] ${pending ? "text-parchment" : "text-ui-muted"}`}>
        {pending ? "W weryfikacji" : "Wolne miejsce"}
      </p>
      <p className="mt-1 text-[13px] text-ui-faint">{pending ? "czeka na decyzję organizatora" : "czeka na Waszą drużynę"}</p>
    </>
  );

  if (pending) return <div className="ui-inset flex min-h-44 flex-col items-center justify-center p-4 text-center">{body}</div>;

  return (
    <TabLink tab="zapisy" className="group ui-inset flex min-h-44 flex-col items-center justify-center p-4 text-center transition-colors hover:border-umber hover:bg-navy/60" aria-label={`Wolne miejsce ${seat} – zapisz drużynę`}>
      {body}
    </TabLink>
  );
}

export function TeamBoard({ teams, pending, max }: { teams: PublicTeam[]; pending: number; max: number }) {
  const empty = Math.max(0, max - teams.length);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {teams.map((team, i) => (
        <TeamCard key={team.id} team={team} seat={i + 1} />
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <EmptySlot key={i} seat={teams.length + i + 1} pending={i < pending} />
      ))}
    </div>
  );
}
