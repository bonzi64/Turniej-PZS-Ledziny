import type { ReactNode } from "react";

// Wspólne klocki stron turnieju w stylu klienta LoL: panel, komunikat, licznik, pasek, awatar, etykieta

export function Panel({ title, children, className = "", aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={`hx-frame ${className}`}>
      {title && (
        <header className="px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="hx-head">{title}</h3>
            {aside}
          </div>
          <div className="hx-divider mt-2.5" data-align="start" aria-hidden />
        </header>
      )}
      <div className="px-5 pt-3.5 pb-5">{children}</div>
    </section>
  );
}

export function Dialog({
  title,
  tone = "info",
  children,
  actions,
}: {
  title: string;
  tone?: "info" | "error";
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className="hx-frame mx-auto max-w-lg animate-rise text-center" data-rule="">
      <div className="px-7 pt-8 pb-7 sm:px-9">
        <h3 className={`font-display text-[28px] leading-tight tracking-[0.04em] text-balance ${tone === "error" ? "text-[#ff9aa8]" : "text-parchment"}`}>{title}</h3>
        <div className="hx-divider mx-auto mt-3.5 max-w-56" aria-hidden />
        <div className="mt-4 text-ui-muted">{children}</div>
        {actions && <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

const SIZES = { sm: "text-[26px]", md: "text-[40px]", lg: "text-[60px]" } as const;

export function Readout({ text, size = "md", label }: { text: string; size?: "sm" | "md" | "lg"; label?: string }) {
  return (
    <span className={`hx-digits ${SIZES[size]}`} aria-label={label}>
      {text}
    </span>
  );
}

export function Meter({ value, max, className = "", label }: { value: number; max: number; className?: string; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={`hx-meter ${className}`} role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

// --- AWATAR: inicjały na kuli w jednym z barwnych tonów, stałym dla danego nicku ---

const TONES = ["#0397ab", "#8a6a2c", "#6b2a6e", "#1f5c3a", "#8a2b3b", "#2a4b8a", "#5a4a8a", "#2a6a6a"];

export function seedHash(seed: string) {
  let h = 2166136261;
  for (const ch of seed.toLowerCase()) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const initials = (seed: string) =>
  seed
    .replace(/#.*$/, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export function Avatar({ seed, size = 24, className = "" }: { seed: string; size?: number; className?: string }) {
  const tone = TONES[seedHash(seed) % TONES.length];
  return (
    <span
      aria-hidden
      className={`hx-avatar ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.4)),
        background: `radial-gradient(circle at 35% 28%, ${tone}, #010a13 82%)`,
      }}
    >
      {initials(seed)}
    </span>
  );
}

export function Chip({ tone, children }: { tone?: "orange" | "gold" | "red" | "green" | "dark"; children: ReactNode }) {
  return (
    <span className="ui-tag" data-tone={tone}>
      {children}
    </span>
  );
}
