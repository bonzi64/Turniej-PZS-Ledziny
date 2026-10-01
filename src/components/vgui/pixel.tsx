import type { CSSProperties } from "react";

// --- FONT 5x7 ---
// Ręcznie rozrysowane glify; "#" = zapalony piksel

const GLYPHS: Record<string, string[]> = {
  A: [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  B: ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"],
  F: ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#    "],
  G: [" ####", "#    ", "#    ", "#  ##", "#   #", "#   #", " ####"],
  H: ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  I: ["###", " # ", " # ", " # ", " # ", " # ", "###"],
  J: ["  ###", "   # ", "   # ", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "# # #", "#   #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#   #", "#### ", "#    ", "#    ", "#    "],
  R: ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
  S: [" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "#   #", "# # #", "# # #", "## ##", "#   #"],
  Y: ["#   #", "#   #", " # # ", "  #  ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "    #", "   # ", "  #  ", " #   ", "#    ", "#####"],
  "0": [" ### ", "#   #", "#  ##", "# # #", "##  #", "#   #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
  "2": [" ### ", "#   #", "    #", "   # ", "  #  ", " #   ", "#####"],
  "3": ["#####", "   # ", "  #  ", "   # ", "    #", "#   #", " ### "],
  "4": ["   # ", "  ## ", " # # ", "#  # ", "#####", "   # ", "   # "],
  "5": ["#####", "#    ", "#### ", "    #", "    #", "#   #", " ### "],
  "6": ["  ## ", " #   ", "#    ", "#### ", "#   #", "#   #", " ### "],
  "7": ["#####", "    #", "   # ", "  #  ", " #   ", " #   ", " #   "],
  "8": [" ### ", "#   #", "#   #", " ### ", "#   #", "#   #", " ### "],
  "9": [" ### ", "#   #", "#   #", " ####", "    #", "   # ", " ##  "],
  ":": [" ", " ", "#", " ", "#", " ", " "],
  "/": ["    #", "    #", "   # ", "  #  ", " #   ", "#    ", "#    "],
  "-": ["   ", "   ", "   ", "###", "   ", "   ", "   "],
  ".": [" ", " ", " ", " ", " ", " ", "#"],
  " ": ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
};

export function pixelRows(text: string) {
  const glyphs = [...text.toUpperCase()].map((ch) => GLYPHS[ch] ?? GLYPHS[" "]);
  return Array.from({ length: 7 }, (_, y) => glyphs.map((g) => g[y]).join(" "));
}

type PixelTextProps = {
  text: string;
  dot?: number;
  ghost?: boolean;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
};

export function PixelText({ text, dot = 4, ghost = false, animate = false, className = "", style, label }: PixelTextProps) {
  const glyphs = [...text.toUpperCase()].map((ch) => GLYPHS[ch] ?? GLYPHS[" "]);
  const width = glyphs.reduce((sum, g) => sum + g[0].length + 1, -1);
  const lit: [number, number][] = [];
  const dim: [number, number][] = [];

  let x = 0;
  for (const glyph of glyphs) {
    glyph.forEach((row, y) =>
      [...row].forEach((cell, dx) => (cell === "#" ? lit : dim).push([x + dx, y])),
    );
    x += glyph[0].length + 1;
  }

  return (
    <svg
      role="img"
      aria-label={label ?? text}
      viewBox={`0 0 ${width} 7`}
      width={width * dot}
      height={7 * dot}
      shapeRendering="crispEdges"
      className={className}
      style={style}
    >
      {ghost && (
        <g fill="currentColor" opacity="0.1">
          {dim.map(([px, py]) => (
            <rect key={`${px}-${py}`} x={px + 0.1} y={py + 0.1} width="0.8" height="0.8" />
          ))}
        </g>
      )}
      <g fill="currentColor">
        {lit.map(([px, py]) => (
          <rect
            key={`${px}-${py}`}
            x={px + 0.08}
            y={py + 0.08}
            width="0.84"
            height="0.84"
            className={animate ? "animate-dot" : undefined}
            style={animate ? { animationDelay: `${(px * 37 + py * 11) % 900}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

// --- IKONA OKNA ---

const EMBLEM = ["#########", "#.......#", "#.#####.#", "#....#..#", "#...#...#", "#..#....#", "#.#####.#", ".#.....#.", "..#####.."];

export function Emblem({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 9 9" width={size} height={size} shapeRendering="crispEdges" aria-hidden className={className}>
      {EMBLEM.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
      )}
    </svg>
  );
}

const LOCK = ["..###..", ".#...#.", ".#...#.", "#######", "###.###", "###.###", "#######"];

export function LockGlyph({ size = 11, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 7 7" width={size} height={size} shapeRendering="crispEdges" aria-label="zamknięte" className={className}>
      {LOCK.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
      )}
    </svg>
  );
}

// --- AWATAR Z NICKU ---

const AVATAR_TONES = ["#c4b550", "#d58c2a", "#9dbb6a", "#7fb0a6", "#c9785a", "#b7a2d0", "#dedfd6"];

function hashOf(seed: string) {
  let h = 2166136261;
  for (const ch of seed.toLowerCase()) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function Identicon({ seed, size = 24, className = "" }: { seed: string; size?: number; className?: string }) {
  const h = hashOf(seed);
  const tone = AVATAR_TONES[h % AVATAR_TONES.length];
  const cells: [number, number][] = [];

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if ((h >>> ((y * 3 + x) % 31)) & 1) {
        cells.push([x, y]);
        if (x < 2) cells.push([4 - x, y]);
      }
    }
  }

  return (
    <svg viewBox="-0.5 -0.5 6 6" width={size} height={size} shapeRendering="crispEdges" aria-hidden className={`shrink-0 bg-vg-ink ${className}`}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={tone} />
      ))}
    </svg>
  );
}
