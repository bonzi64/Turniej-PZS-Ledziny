import { LiveSlots } from "@/components/module/LiveSlots";
import { TabLink } from "@/components/module/TabLink";
import { PixelText } from "@/components/vgui/pixel";
import { LedCountdown } from "@/components/vgui/LedCountdown";
import { Group } from "@/components/vgui/Window";
import { EVENT } from "@/content/event";
import type { GameModule } from "@/lib/games";
import type { SlotStat } from "@/lib/queries";

export function ModuleOverview({
  game,
  stats,
  open,
  closedReason,
}: {
  game: GameModule;
  stats: SlotStat[];
  open: boolean;
  closedReason: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end gap-5">
          <div className="vg-deep px-4 py-3" style={{ color: game.accent }}>
            <PixelText text={game.short} dot={9} className="drop-shadow-[0_0_8px_currentColor]" label={game.name} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] text-vg-muted uppercase">Moduł {game.no}</p>
            <p className="text-[22px] leading-tight font-bold text-vg-gold text-emboss">{game.name}</p>
            <p className="mt-1 max-w-md text-[12px] text-vg-muted">{game.blurb}</p>
          </div>
        </div>

        <Group legend="Ustawienia serwera">
          <dl className="vg-deep text-[12px]">
            {[
              ["Tryb", game.mode.join(" · ")],
              ["System", "Pojedyncza eliminacja, 8 drużyn"],
              ["Skład", "5 graczy + 1 rezerwowy"],
              ["Termin", `${EVENT.dateLabel}, start ${EVENT.kickoff}`],
              ["Zapisy", open ? `otwarte do ${EVENT.registrationClosesLabel}` : "zamknięte"],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-2 border-b border-vg-ink/70 px-2 py-1.5 last:border-b-0">
                <dt className="text-vg-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Group>

        <div className="flex flex-wrap gap-1.5">
          <TabLink tab="regulamin" className="vg-btn min-w-32">
            Czytaj regulamin
          </TabLink>
          <TabLink tab="zapisy" className="vg-btn min-w-32" data-default="">
            {closedReason ? "Zapisy zamknięte" : "Zapisz drużynę"}
          </TabLink>
          <TabLink tab="druzyny" className="vg-btn">
            Lista drużyn
          </TabLink>
          <TabLink tab="drabinka" className="vg-btn">
            Drabinka
          </TabLink>
        </div>
      </div>

      <div className="space-y-5">
        <LiveSlots slug={game.slug} initial={stats} open={open} />
        <Group legend="Do rozpoczęcia">
          <LedCountdown target={EVENT.startsAt} dot={4} />
        </Group>
      </div>
    </div>
  );
}
