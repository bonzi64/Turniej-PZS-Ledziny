import type { CSSProperties } from "react";

// Iskry hextech nad rdzeniem banera: dziesięć drobnych, przygaszonych kropek unoszących się w pętli.
// Wartości są wpisane na sztywno, żeby serwer i każda przeglądarka renderowały identyczny HTML.
// [pozycja %, rozmiar px, czas s, opóźnienie s, dryf px, krycie, złota?]
const SEEDS = [
  [70, 2.2, 9.9, -11.6, -21, 0.45, 0], [55, 2.6, 9.1, -7.5, -23, 0.32, 1], [46, 2.4, 13.3, -0.5, 19, 0.3, 0],
  [31, 3, 11.3, -1.5, -18, 0.45, 1], [77, 2.6, 13.3, -3.7, -19, 0.34, 0], [64, 3, 11.8, -13.6, 11, 0.4, 1],
  [50, 2.8, 7.8, -6, 26, 0.36, 0], [58, 3, 12.2, -10.3, 2, 0.5, 1], [42, 2.2, 7.9, -4.3, 2, 0.48, 0],
  [36, 2.8, 8.5, -4.9, 11, 0.44, 0],
] as const;

const MOTES = SEEDS.map(
  ([left, size, duration, delay, drift, alpha, gold]) =>
    ({
      left: `${left}%`,
      "--mote-size": `${size}px`,
      "--mote-duration": `${duration}s`,
      "--mote-delay": `${delay}s`,
      "--mote-drift": `${drift}px`,
      "--mote-alpha": alpha,
      "--mote-color": gold ? "#c8aa6e" : "#cdfafa",
    }) as CSSProperties,
);

export function Motes({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      {MOTES.map((style, i) => (
        <span key={i} className="hx-mote" style={style} />
      ))}
    </div>
  );
}
