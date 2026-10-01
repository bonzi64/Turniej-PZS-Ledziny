import { Avatar, Chip } from "@/components/skin/parts";
import type { PublicTeam } from "@/lib/queries";

function TeamCard({ team, seat }: { team: PublicTeam; seat: number }) {
  return (
    <article className="ui-card p-2.5">
      <header className="flex items-center gap-3 border-b border-ui-line pb-2.5">
        <Avatar seed={team.name} size={34} />
        <div className="min-w-0 flex-1">
          <h3 className="ui-name truncate text-[16px] leading-tight">{team.name}</h3>
          <p className="text-[12px] text-ui-muted">
            Slot {seat}
            {team.tag && ` · [${team.tag}]`}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {team.classes.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </header>

      <ul className="mt-2.5 space-y-1">
        {team.roster.map((player, i) => (
          <li key={`${player.nickname}-${i}`} className="ui-inset ui-row flex items-center gap-2.5 px-2 py-1.5 text-[12px]">
            <Avatar seed={player.nickname} size={20} />
            <span className="min-w-0 flex-1 truncate" title={player.nickname}>
              {player.nickname}
            </span>
            <span className="text-[12px] text-ui-muted">{player.schoolClass}</span>
            {player.captain ? <Chip tone="orange">Kapitan</Chip> : player.reserve ? <Chip tone="dark">Rezerwa</Chip> : <Chip tone="gold">Gracz</Chip>}
          </li>
        ))}
      </ul>
    </article>
  );
}

function EmptySlot({ seat, pending }: { seat: number; pending: boolean }) {
  return (
    <div className="ui-card flex min-h-40 flex-col items-center justify-center gap-1 p-4 text-center opacity-75">
      <p className="text-[12px] text-ui-faint">Slot {seat}</p>
      <p className={pending ? "ui-name text-[16px]" : "text-ui-muted"}>{pending ? "Zgłoszenie w weryfikacji" : "Wolny slot"}</p>
      <p className="text-[12px] text-ui-faint">{pending ? "czeka na decyzję organizatora" : "czeka na Waszą drużynę"}</p>
    </div>
  );
}

export function TeamBoard({ teams, pending, max }: { teams: PublicTeam[]; pending: number; max: number }) {
  const empty = Math.max(0, max - teams.length);

  return (
    <div>
      <p className="mb-3 text-[13px] text-ui-muted">Zatwierdzone składy. Publicznie pokazujemy tylko nicki, nazwę drużyny i klasę.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {teams.map((team, i) => (
          <TeamCard key={team.id} team={team} seat={i + 1} />
        ))}
        {Array.from({ length: empty }, (_, i) => (
          <EmptySlot key={i} seat={teams.length + i + 1} pending={i < pending} />
        ))}
      </div>
    </div>
  );
}
