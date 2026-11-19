"use client";

import { type CSSProperties, useId } from "react";

// Rdzeń hextech: metalowy pierścień z czterema rombami, złote łuki-klamry i fasetowany kryształ.
// Warstwy pojawiają się kolejno – na wejściu banera (draw) albo w takt ładowania intro (progress 0–1).

const LAYERS = {
  ring: [0, 0.35],
  studs: [0.25, 0.2],
  arcs: [0.4, 0.3],
  crystal: [0.6, 0.4],
} as const;

type Layer = keyof typeof LAYERS;

const amount = (layer: Layer, progress: number) => {
  const [start, span] = LAYERS[layer];
  return Math.min(1, Math.max(0, (progress - start) / span));
};

const FACETS = [
  { points: "0,-62 22,-30 0,-14 -22,-30", fill: "a" },
  { points: "22,-30 0,-14 0,10 26,-6", fill: "b" },
  { points: "-22,-30 0,-14 0,10 -26,-6", fill: "#0a323c" },
  { points: "0,10 26,-6 14,40 0,52", fill: "#005a82" },
  { points: "0,10 -26,-6 -14,40 0,52", fill: "#062a33" },
] as const;

const ARCS = "M-52 -40 A66 66 0 0 1 -14 -64 M52 -40 A66 66 0 0 0 14 -64 M-52 44 A66 66 0 0 0 -14 66 M52 44 A66 66 0 0 1 14 66";
const STUDS = "M0 -96 L10 -84 L0 -76 L-10 -84 Z M0 96 L10 84 L0 76 L-10 84 Z M-96 0 L-84 10 L-76 0 L-84 -10 Z M96 0 L84 10 L76 0 L84 -10 Z";

export function HextechCore({
  size = 200,
  className = "",
  progress,
  draw = false,
  float = true,
}: {
  size?: number | string;
  className?: string;
  progress?: number;
  draw?: boolean;
  float?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const timed = progress !== undefined;

  // tryb intro: kreska i krycie liczone z postępu; tryb banera: kolejne opóźnienia animacji wejścia
  const stroke = (layer: Layer): CSSProperties | undefined => {
    if (timed) return { strokeDasharray: 1, strokeDashoffset: 1 - amount(layer, progress), transition: "stroke-dashoffset 220ms linear" };
    if (draw) return { animationDelay: `${Math.round(LAYERS[layer][0] * 900)}ms` };
    return undefined;
  };
  const fade = (layer: Layer, offset = 0): CSSProperties | undefined => {
    if (timed) return { opacity: Math.min(1, Math.max(0, amount(layer, progress) * 1.6 - offset)), transition: "opacity 260ms linear" };
    if (draw) return { animationDelay: `${Math.round(LAYERS[layer][0] * 900 + offset * 400)}ms` };
    return undefined;
  };
  const drawn = !timed && draw ? "hx-draw" : undefined;
  const faded = !timed && draw ? "hx-fade-in" : undefined;

  return (
    <svg viewBox="-100 -100 200 200" width={size} height={size} className={`${draw ? "hx-rune-in" : ""} ${className}`} aria-hidden overflow="visible">
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0e6d2" />
          <stop offset="0.45" stopColor="#c8aa6e" />
          <stop offset="1" stopColor="#785a28" />
        </linearGradient>
        <linearGradient id={id("a")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cdfafa" />
          <stop offset="1" stopColor="#0397ab" />
        </linearGradient>
        <linearGradient id={id("b")} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0ac8b9" />
          <stop offset="1" stopColor="#005a82" />
        </linearGradient>
      </defs>

      <circle r="86" fill="none" stroke={`url(#${id("metal")})`} strokeWidth="5" pathLength={1} className={drawn} style={stroke("ring")} />
      <circle r="78" fill="none" stroke="#463714" strokeWidth="1.2" pathLength={1} className={drawn} style={stroke("ring")} />
      <path d={STUDS} fill="#010a13" stroke={`url(#${id("metal")})`} strokeWidth="2" className={faded} style={fade("studs")} />
      <g className={float && !timed ? "animate-arcs" : undefined}>
        <path d={ARCS} fill="none" stroke={`url(#${id("metal")})`} strokeWidth="3" strokeLinecap="round" pathLength={1} className={drawn} style={stroke("arcs")} />
      </g>

      <g className={float && !timed ? "animate-crystal" : undefined}>
        <g transform="rotate(-8)">
          {FACETS.map((facet, i) => (
            <polygon
              key={facet.points}
              points={facet.points}
              fill={facet.fill === "a" || facet.fill === "b" ? `url(#${id(facet.fill)})` : facet.fill}
              className={faded}
              style={fade("crystal", i * 0.12)}
            />
          ))}
          <polyline
            points="0,-62 22,-30 26,-6 14,40 0,52 -14,40 -26,-6 -22,-30 0,-62"
            fill="none"
            stroke="#cdfafa"
            strokeOpacity="0.7"
            strokeWidth="0.8"
            pathLength={1}
            className={drawn}
            style={stroke("crystal")}
          />
        </g>
      </g>
    </svg>
  );
}
