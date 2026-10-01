import type { ReactNode } from "react";
import { Emblem, Identicon, PixelText } from "@/components/vgui/pixel";
import { Progress } from "@/components/vgui/Window";

// --- PANEL ---

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`vg-group ${className}`}>
      {title && <span className="vg-legend">{title}</span>}
      {children}
    </div>
  );
}

// --- OKNO KOMUNIKATU ---

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
    <div role={tone === "error" ? "alert" : "status"} className="vg-window mx-auto max-w-md">
      <div className="vg-titlebar">
        <Emblem className={tone === "error" ? "text-vg-orange" : "text-vg-gold"} />
        <span>{title}</span>
      </div>
      <div className="px-4 pb-4">
        {children}
        {actions && <div className="mt-4 flex justify-end gap-1.5">{actions}</div>}
      </div>
    </div>
  );
}

// --- LICZNIK ---

const DOT = { sm: 4, md: 6, lg: 9 } as const;

export function Readout({ text, size = "md", label }: { text: string; size?: "sm" | "md" | "lg"; label?: string }) {
  return (
    <span className="vg-deep inline-flex px-3 py-2 text-vg-gold">
      <PixelText text={text} dot={DOT[size]} ghost label={label ?? text} className="drop-shadow-[0_0_5px_rgb(196_181_80/0.5)]" />
    </span>
  );
}

// --- PASEK ---

export function Meter({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  return <Progress value={value} max={max} blocks={max * 3} className={className} />;
}

// --- AWATAR ---

export function Avatar({ seed, size = 24, className = "" }: { seed: string; size?: number; className?: string }) {
  return <Identicon seed={seed} size={size} className={className} />;
}

export function Chip({ tone, children }: { tone?: "orange" | "gold" | "red" | "green" | "dark"; children: ReactNode }) {
  return (
    <span className="ui-tag" data-tone={tone}>
      {children}
    </span>
  );
}
