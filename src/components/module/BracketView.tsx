import { HextechCore } from "@/components/hx/HextechCore";
import { Avatar } from "@/components/skin/parts";
import type { BracketMatch, PublicTeam } from "@/lib/queries";
import { matchLabel, ROUNDS } from "@/lib/tournament";

const timeFmt = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });

function Side({ team, score, state }: { team: PublicTeam | null; score: number | null; state: "win" | "lose" | "idle" }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 ${state === "win" ? "ui-hilite" : ""}`}>
      {team ? <Avatar seed={team.name} size={20} /> : <span className="size-3 shrink-0 rotate-45 border border-umber" />}
      <span className={`min-w-0 flex-1 truncate ${state === "win" ? "ui-name" : state === "lose" ? "text-ui-faint line-through decoration-ui-faint/60" : team ? "text-parchment" : "text-ui-faint"}`}>
        {team?.name ?? "Do ustalenia"}
      </span>
      <span className={`w-6 text-right tabular ${state === "win" ? "font-bold text-teal" : "text-ui-muted"}`}>{score ?? ""}</span>
    </div>
  );
}

function MatchBox({ match }: { match: BracketMatch }) {
  const stateOf = (side: "A" | "B") => (!match.winner ? "idle" : match.winner === side ? "win" : "lose");

  return (
    <div className={`ui-inset text-[14px] ${match.winner ? "" : match.teamA && match.teamB ? "border-umber" : ""}`}>
      <div className="ui-subhead flex justify-between px-3 py-1">
        <span>{matchLabel(match.round, match.slot)}</span>
        <span className="tabular">
          {match.format}
          {match.startsAt && ` · ${timeFmt.format(new Date(match.startsAt))}`}
        </span>
      </div>
      <Side team={match.teamA} score={match.scoreA} state={stateOf("A")} />
      <div className="h-px bg-hull" />
      <Side team={match.teamB} score={match.scoreB} state={stateOf("B")} />
    </div>
  );
}

export function BracketView({ rounds }: { rounds: BracketMatch[][] }) {
  const final = rounds.at(-1)?.[0];
  const champion = final?.winner ? (final.winner === "A" ? final.teamA : final.teamB) : null;

  return (
    <div className="hx-frame ui-scroll overflow-x-auto p-4 sm:p-5">
      <div className="grid min-w-[58rem] grid-cols-[1fr_1fr_1fr_0.9fr]">
        {rounds.map((matches, r) => {
          const pairs = matches.length > 1 ? Array.from({ length: matches.length / 2 }, (_, i) => matches.slice(i * 2, i * 2 + 2)) : [matches];
          return (
            <div key={ROUNDS[r].round} className="flex flex-col">
              <p className="ui-col-head mx-4 mb-4">{ROUNDS[r].label}</p>
              <div className="flex h-[32rem] flex-col">
                {pairs.map((pair, i) => (
                  <div
                    key={i}
                    className={`relative flex flex-1 flex-col justify-around ${pair.length === 2 ? "after:absolute after:top-1/4 after:right-0 after:bottom-1/4 after:w-px after:bg-bronze" : ""}`}
                  >
                    {pair.map((match) => (
                      <div
                        key={match.slot}
                        className={`relative px-4 after:absolute after:top-1/2 after:right-0 after:h-px after:w-4 after:bg-bronze ${
                          r > 0 ? "before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-bronze" : ""
                        }`}
                      >
                        <MatchBox match={match} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex flex-col">
          <p className="ui-col-head mx-4 mb-4">Zwycięzca</p>
          <div className="flex h-[32rem] items-center">
            <div className="relative w-full px-4 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-bronze">
              <div className="hx-frame relative overflow-hidden p-4 text-center" data-rule="">
                <div className="mx-auto grid size-28 place-items-center">
                  {champion ? (
                    <span className="hx-ring size-20">
                      <Avatar seed={champion.name} size={68} />
                    </span>
                  ) : (
                    <HextechCore size="100%" float={false} className="opacity-60 grayscale-[0.5]" />
                  )}
                </div>
                {champion ? (
                  <>
                    <p className="ui-name mt-3 text-[17px]">{champion.name}</p>
                    <p className="text-[13px] text-ui-muted">{champion.classes.join(" / ")}</p>
                  </>
                ) : (
                  <p className="mt-3 text-[14px] text-ui-muted">Zwycięzca finału pojawi się tutaj</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
