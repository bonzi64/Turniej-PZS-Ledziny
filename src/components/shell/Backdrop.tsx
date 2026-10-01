"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const SCENES = {
  cs2: { base: "#050b16", haze: "#173463", streak: "#e9c84a" },
  hub: { base: "#050b14", haze: "#1a2f52", streak: "#d9c04f" },
} as const;

// stitchTiles – bez widocznych szwów przy powtarzaniu kafla
const SMOKE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1100' height='1100'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.0035 0.008' numOctaves='5' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.7 0 0 0 -0.62'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")";

export function Backdrop() {
  const pathname = usePathname();
  const key = pathname.startsWith("/cs2") ? "cs2" : "hub";
  const scene = SCENES[key];

  const vars = { "--bd-base": scene.base, "--bd-haze": scene.haze, "--bd-streak": scene.streak } as CSSProperties;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={vars}>
      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{ background: "radial-gradient(110% 80% at 72% 35%, var(--bd-haze) 0%, var(--bd-base) 58%, #010205 100%)" }}
      />
      <div className="absolute -inset-[30%] animate-drift opacity-[0.13]" style={{ backgroundImage: SMOKE, backgroundSize: "1100px 1100px" }} />

      <div className="absolute top-[29%] -left-[8%] h-28 w-[52%] rounded-[50%] opacity-35 blur-3xl" style={{ background: "var(--bd-streak)" }} />
      <div className="absolute inset-x-0 top-[31%] animate-streak">
        {[
          { top: 0, width: "78%", opacity: 0.55, h: 2 },
          { top: 14, width: "64%", opacity: 0.3, h: 1 },
          { top: 31, width: "86%", opacity: 0.4, h: 1 },
          { top: 58, width: "52%", opacity: 0.22, h: 1 },
        ].map((line) => (
          <span
            key={line.top}
            className="absolute left-0 block"
            style={{
              top: line.top,
              width: line.width,
              height: line.h,
              opacity: line.opacity,
              background: "linear-gradient(90deg, transparent 0%, var(--bd-streak) 18%, var(--bd-streak) 40%, transparent 100%)",
              boxShadow: "0 0 10px var(--bd-streak)",
            }}
          />
        ))}
      </div>

      <span className="absolute top-0 bottom-0 left-[19%] w-px bg-white/[0.04]" />
      <span className="absolute top-0 bottom-0 left-[37%] w-px bg-white/[0.025]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.75)_100%)]" />
    </div>
  );
}
