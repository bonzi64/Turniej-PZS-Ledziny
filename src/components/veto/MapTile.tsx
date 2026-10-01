import type { ReactNode } from "react";
import type { CsMap } from "@/lib/veto/maps";

// --- RADAR ---
// Abstrakcyjny "overview" mapy generowany z id: deterministyczny, identyczny na serwerze i w przeglądarce

function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10_000) / 10_000;
  };
}

function Radar({ id, tone }: { id: string; tone: string }) {
  const rnd = seeded(id);
  const rooms = Array.from({ length: 8 }, () => {
    const w = 12 + Math.round(rnd() * 26);
    const h = 10 + Math.round(rnd() * 20);
    return { x: 4 + Math.round(rnd() * (92 - w)), y: 4 + Math.round(rnd() * (68 - h)), w, h };
  });

  return (
    <svg viewBox="0 0 100 76" className="absolute inset-0 size-full" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden>
      {rooms.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={tone} fillOpacity={0.14} stroke={tone} strokeOpacity={0.45} strokeWidth={0.6} />
      ))}
      {rooms.slice(1).map((room, i) => (
        <path
          key={`p${i}`}
          d={`M${rooms[i].x + rooms[i].w / 2} ${rooms[i].y + rooms[i].h / 2} H${room.x + room.w / 2} V${room.y + room.h / 2}`}
          fill="none"
          stroke={tone}
          strokeOpacity={0.3}
          strokeWidth={2.2}
        />
      ))}
    </svg>
  );
}

// --- KAFEL ---

export type TileState = "open" | "ban" | "pick" | "decider";

type TileProps = {
  map: CsMap;
  state?: TileState;
  mark?: string;
  order?: number;
  auto?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  footer?: ReactNode;
};

const MARK_TONE = { ban: "red", pick: "gold", decider: "green", open: undefined } as const;

export function MapTile({ map, state = "open", mark, order, auto, selectable, selected, onSelect, footer }: TileProps) {
  const Tag = selectable ? "button" : "div";

  return (
    <Tag
      {...(selectable ? { type: "button" as const, onClick: onSelect, "data-sfx": "tick", "aria-pressed": Boolean(selected) } : {})}
      className={`group block w-full p-1 text-left ${selected ? "bg-vg-select" : "vg-panel"} ${selectable ? "cursor-default hover:bg-[#56644d]" : ""}`}
    >
      <div className="vg-deep relative aspect-[4/3] overflow-hidden">
        <div className={`absolute inset-0 ${state === "ban" ? "opacity-35 grayscale" : ""}`}>
          <Radar id={map.id} tone={map.tone} />
        </div>
        <span className="absolute top-0 left-0 bg-vg-ink/85 px-1.5 text-[10px] text-vg-muted">{map.code}</span>
        {order !== undefined && <span className="absolute top-0 right-0 bg-vg-ink/85 px-1.5 text-[10px] text-vg-muted tabular">#{order + 1}</span>}

        {state === "ban" && (
          <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden>
            <line x1="4" y1="71" x2="96" y2="4" pathLength={1} className="strike-line" stroke="#c8452f" strokeWidth="3" />
          </svg>
        )}

        {state !== "open" && mark && (
          <span className="absolute inset-x-0 bottom-1.5 flex flex-col items-center gap-0.5">
            <span className="vg-tag" data-tone={MARK_TONE[state]}>
              {mark}
            </span>
            {auto && <span className="bg-vg-ink/80 px-1 text-[9px] text-vg-muted">auto – minął czas</span>}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between px-1 pt-1">
        <span className={`text-[13px] font-bold ${state === "ban" ? "text-vg-faint line-through" : selected ? "text-white" : "text-vg-text"}`}>{map.name}</span>
        <span className="size-2" style={{ background: map.tone }} aria-hidden />
      </div>
      {footer}
    </Tag>
  );
}
