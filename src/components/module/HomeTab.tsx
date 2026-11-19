import type { ReactNode } from "react";
import { HextechCore } from "@/components/hx/HextechCore";
import { ChevronIcon } from "@/components/hx/icons";
import { CountdownInline, LiveSlotCount } from "@/components/hx/live";
import { HowToSteps } from "@/components/module/HowToSteps";
import { TabLink } from "@/components/module/TabLink";
import { Avatar } from "@/components/skin/parts";
import { EVENT } from "@/content/event";
import type { BracketMatch, SlotStat } from "@/lib/queries";

const timeFmt = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });

function Fact({ label, live = false, className = "", children }: { label: string; live?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`min-w-0 border border-umber bg-void/70 px-4 py-2.5 ${className}`}>
      <dt className="flex items-center gap-1.5 text-[12px] font-bold tracking-[0.14em] text-ui-muted uppercase">
        {live && <span aria-hidden className="hx-dot size-1.5 animate-live bg-teal" />}
        {label}
      </dt>
      <dd className={`mt-1 font-display text-[21px] leading-tight whitespace-nowrap tabular ${live ? "text-teal-hi" : "text-parchment"}`}>{children}</dd>
    </div>
  );
}

function Banner({ stats, closedReason }: { stats: SlotStat[]; closedReason: string | null }) {
  return (
    <section aria-labelledby="banner-title" className="hx-frame relative overflow-hidden" data-rule="">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#10233a_0%,#0a1626_38%,#030b15_100%)]" />

      <div className="relative grid items-center gap-6 px-5 pt-7 pb-8 sm:px-10 sm:pt-10 sm:pb-11 lg:min-h-[470px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-6">
        <div data-rune-target className="relative size-[132px] sm:size-[190px] lg:order-last lg:mx-auto lg:size-[min(100%,360px)]">
          <HextechCore size="100%" draw className="absolute inset-0" />
        </div>

        <div className="relative max-w-[600px]">
          <h1 id="banner-title" className="font-display text-[46px] leading-[0.95] tracking-[0.01em] text-parchment text-balance sm:text-[64px] lg:text-[84px]">
            Turniej PZS Lędziny
          </h1>
          <p className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-sand sm:text-[17px]">
            Szkolny turniej League of Legends. Osiem drużyn, jeden piątek i Summoner&apos;s Rift w szkolnej pracowni. Zgłoś piątkę z rezerwowym, zanim skończą się miejsca.
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            <Fact label="Turniej">
              {EVENT.dateLabel.slice(0, 5)} · {EVENT.kickoff}
            </Fact>
            <Fact label="Do startu" live className="order-first col-span-2 sm:order-none">
              <CountdownInline target={EVENT.startsAt} seconds={false} />
            </Fact>
            <Fact label="Drużyny" live>
              <LiveSlotCount initial={stats} />
            </Fact>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {closedReason ? (
              <TabLink tab="drabinka" data-tone="gold" data-size="lg" className="ui-btn">
                Zobacz drabinkę
              </TabLink>
            ) : (
              <TabLink tab="zapisy" data-tone="gold" data-size="lg" className="ui-btn">
                Zapisz drużynę
              </TabLink>
            )}
            <TabLink tab="regulamin" className="group inline-flex items-center gap-1.5 font-display text-[16px] tracking-[0.05em] text-gold transition-colors hover:text-parchment">
              Przeczytaj regulamin
              <ChevronIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
            </TabLink>
          </div>
          {closedReason && <p className="mt-3 text-[14px] text-ui-muted">{closedReason}</p>}
        </div>
      </div>
    </section>
  );
}

function BracketPeek({ bracket }: { bracket: BracketMatch[][] }) {
  const quarter = bracket[0] ?? [];
  return (
    <section aria-labelledby="peek-title" className="hx-frame flex flex-col p-5" data-rule="">
      <h2 id="peek-title" className="hx-head">
        Ćwierćfinały
      </h2>
      <div className="hx-divider mt-2.5" data-align="start" aria-hidden />
      <ol className="mt-4 space-y-2">
        {quarter.map((match) => (
          <li key={match.slot} className="ui-inset px-3 py-2">
            <div className="flex items-center justify-between text-[12px] font-bold tracking-[0.12em] text-ui-faint uppercase">
              <span>Mecz {match.slot + 1}</span>
              <span className="tabular">{match.startsAt ? timeFmt.format(new Date(match.startsAt)) : "BO1"}</span>
            </div>
            {[match.teamA, match.teamB].map((team, i) => (
              <div key={i} className="mt-1 flex items-center gap-2 text-[14px]">
                {team ? <Avatar seed={team.name} size={16} /> : <span className="size-4 shrink-0 rotate-45 border border-umber" />}
                <span className={`min-w-0 flex-1 truncate ${team ? "text-parchment" : "text-ui-faint"}`}>{team?.name ?? "Wolne miejsce"}</span>
                <span className="text-ui-muted tabular">{(i === 0 ? match.scoreA : match.scoreB) ?? ""}</span>
              </div>
            ))}
          </li>
        ))}
      </ol>
      <TabLink tab="drabinka" className="group mt-4 inline-flex items-center gap-1.5 self-start font-display text-[15px] tracking-[0.05em] text-gold transition-colors hover:text-parchment">
        Pełna drabinka
        <ChevronIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
      </TabLink>
    </section>
  );
}

function MatchRules() {
  const rows = [
    ["Mapa", "Summoner's Rift, 5 na 5"],
    ["Tryb", "Tournament Draft, gra niestandardowa"],
    ["Format", "BO1 w każdej rundzie, także w finale"],
    ["Skład", "5 graczy + 1 rezerwowy"],
    ["Konta", "Każdy gra na własnym koncie Riot"],
    ["Miejsce", `Pracownia PZS, zbiórka ${EVENT.checkIn}`],
  ];
  return (
    <section aria-labelledby="rules-title" className="hx-frame flex flex-col p-5" data-rule="">
      <h2 id="rules-title" className="hx-head">
        Zasady meczu
      </h2>
      <div className="hx-divider mt-2.5" data-align="start" aria-hidden />
      <dl className="mt-3 divide-y divide-hull">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-3 py-2.5 text-[14px]">
            <dt className="font-medium text-ui-muted">{label}</dt>
            <dd className="text-parchment">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function HomeTab({ stats, bracket, closedReason }: { stats: SlotStat[]; bracket: BracketMatch[][]; closedReason: string | null }) {
  return (
    <div className="space-y-5">
      <Banner stats={stats} closedReason={closedReason} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr]">
        <HowToSteps closed={Boolean(closedReason)} />
        <BracketPeek bracket={bracket} />
        <MatchRules />
      </div>
    </div>
  );
}
