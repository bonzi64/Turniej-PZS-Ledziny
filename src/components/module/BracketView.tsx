import Link from "next/link";
import { Avatar } from "@/components/skin/parts";
import type { BracketMatch, PublicTeam } from "@/lib/queries";
import { matchLabel, ROUNDS } from "@/lib/tournament";
import { mapById } from "@/lib/veto/maps";

const timeFmt = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });

function Side({ team, score, state }: { team: PublicTeam | null; score: number | null; state: "win" | "lose" | "idle" }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 ${state === "win" ? "ui-hilite" : ""}`}>
      {team ? <Avatar seed={team.name} size={16} /> : <span className="size-4 shrink-0 bg-ui-line" />}
      <span className={`min-w-0 flex-1 truncate ${state === "win" ? "ui-name" : state === "lose" || !team ? "text-ui-faint" : ""}`}>{team?.name ?? "TBD"}</span>
      <span className={`w-7 text-right tabular ${state === "win" ? "font-bold text-ui-accent" : "text-ui-muted"}`}>
        {score ?? "-"}
      </span>
    </div>
  );
}

function MatchBox({ match, withVeto }: { match: BracketMatch; withVeto: boolean }) {
  const stateOf = (side: "A" | "B") => (!match.winner ? "idle" : match.winner === side ? "win" : "lose");
  const maps = match.picks.map((p) => mapById(p.map)?.name ?? p.map);

  return (
    <div className="ui-inset text-[12px]">
      <div className="ui-subhead flex justify-between px-2 py-0.5">
        <span>{matchLabel(match.round, match.slot)}</span>
        <span>
          {match.format}
          {match.startsAt && ` · ${timeFmt.format(new Date(match.startsAt))}`}
        </span>
      </div>
      <Side team={match.teamA} score={match.scoreA} state={stateOf("A")} />
      <div className="h-px bg-ui-line" />
      <Side team={match.teamB} score={match.scoreB} state={stateOf("B")} />
      {withVeto && (maps.length > 0 || match.veto !== "off") && match.id && (
        <div className="flex items-center justify-between gap-2 border-t border-ui-line px-2 py-1 text-[10px]">
          <span className="truncate text-ui-muted">{maps.length ? maps.join(" · ") : match.veto === "live" ? "veto trwa" : "veto: lobby"}</span>
          <Link href={`/cs2/veto/${match.id}`} data-sfx="" className="shrink-0 text-ui-accent hover:underline">
            {match.veto === "live" ? "● na żywo" : "pokój"}
          </Link>
        </div>
      )}
    </div>
  );
}

export function BracketView({ rounds, withVeto }: { rounds: BracketMatch[][]; withVeto: boolean }) {
  const final = rounds.at(-1)?.[0];
  const champion = final?.winner ? (final.winner === "A" ? final.teamA : final.teamB) : null;

  return (
    <div className="ui-scroll ui-inset overflow-x-auto p-3">
      <div className="grid min-w-[54rem] grid-cols-[1fr_1fr_1fr_0.8fr]">
        {rounds.map((matches, r) => {
          const pairs = matches.length > 1 ? Array.from({ length: matches.length / 2 }, (_, i) => matches.slice(i * 2, i * 2 + 2)) : [matches];
          return (
            <div key={ROUNDS[r].round} className="flex flex-col">
              <p className="ui-col-head mx-4 mb-3">{ROUNDS[r].label}</p>
              <div className="flex h-[30rem] flex-col">
                {pairs.map((pair, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-1 flex-col justify-around ${
                      pair.length === 2 ? "after:absolute after:top-1/4 after:right-0 after:bottom-1/4 after:w-px after:bg-ui-faint" : ""
                    }`}
                  >
                    {pair.map((match) => (
                      <div
                        key={match.slot}
                        className={`relative px-4 after:absolute after:top-1/2 after:right-0 after:h-px after:w-4 after:bg-ui-faint ${
                          r > 0 ? "before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-ui-faint" : ""
                        }`}
                      >
                        <MatchBox match={match} withVeto={withVeto} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex flex-col">
          <p className="ui-col-head mx-4 mb-3">Zwycięzca</p>
          <div className="flex h-[30rem] items-center">
            <div className="relative w-full px-4 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-ui-faint">
              <div className="ui-card p-3 text-center">
                {champion ? (
                  <>
                    <div className="flex justify-center">
                      <Avatar seed={champion.name} size={44} />
                    </div>
                    <p className="ui-name mt-2 text-[16px]">{champion.name}</p>
                    <p className="text-[12px] text-ui-muted">{champion.classes.join(" / ")}</p>
                  </>
                ) : (
                  <p className="py-4 text-ui-faint">jeszcze nie wiadomo</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
