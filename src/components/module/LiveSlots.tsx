"use client";

import { Chip, Meter, Panel, Readout } from "@/components/skin/parts";
import { usePoll } from "@/hooks/usePoll";
import type { GameSlug } from "@/lib/games";
import type { SlotStat } from "@/lib/queries";

const two = (n: number) => String(n).padStart(2, "0");

export function LiveSlots({ slug, initial, open }: { slug: GameSlug; initial: SlotStat[]; open: boolean }) {
  const [stats] = usePoll("/api/slots", 8_000, initial);
  const stat = stats.find((s) => s.slug === slug) ?? { taken: 0, approved: 0, pending: 0, max: 8 };
  const full = stat.taken >= stat.max;

  return (
    <Panel title="Zapisane drużyny">
      <div className="flex items-center justify-between gap-3" aria-live="polite">
        <Readout text={`${two(stat.taken)}/${two(stat.max)}`} label={`${stat.taken} z ${stat.max}`} />
        <Chip tone={full || !open ? "red" : "green"}>{full ? "Komplet" : open ? "Otwarte" : "Zamknięte"}</Chip>
      </div>
      <Meter value={stat.taken} max={stat.max} className="mt-3" />
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div className="ui-inset px-2 py-1.5">
          <dt className="text-ui-muted">Zatwierdzone</dt>
          <dd className="font-bold tabular">{stat.approved}</dd>
        </div>
        <div className="ui-inset px-2 py-1.5">
          <dt className="text-ui-muted">W weryfikacji</dt>
          <dd className="font-bold tabular">{stat.pending}</dd>
        </div>
      </dl>
    </Panel>
  );
}
