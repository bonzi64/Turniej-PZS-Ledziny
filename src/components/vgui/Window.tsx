import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Emblem } from "@/components/vgui/pixel";

type WindowProps = {
  title: string;
  children: ReactNode;
  closeHref?: string;
  status?: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
};

export function CloseBox({ href }: { href: string }) {
  return (
    <Link
      href={href}
      data-sfx=""
      aria-label="Zamknij okno"
      className="vg-btn ml-auto size-[18px] min-h-0 p-0 text-[11px] leading-none font-bold"
    >
      ✕
    </Link>
  );
}

export function Window({ title, children, closeHref, status, className = "", bodyClassName = "px-3 pb-3 sm:px-4 sm:pb-4", id }: WindowProps) {
  return (
    <section id={id} aria-label={title} className={`vg-window ${className}`}>
      <header className="vg-titlebar">
        <Emblem className="text-vg-gold" />
        <h2 className="min-w-0 truncate">{title}</h2>
        {closeHref && <CloseBox href={closeHref} />}
      </header>
      <div className={bodyClassName}>{children}</div>
      {status && <footer className="vg-statusbar">{status}</footer>}
    </section>
  );
}

export function Group({ legend, children, className = "" }: { legend?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`vg-group ${className}`}>
      {legend && <span className="vg-legend">{legend}</span>}
      {children}
    </div>
  );
}

// wypełnienie liczone od szerokości paska – pełny pasek dokładnie przy value = max, na każdym ekranie
export function Progress({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const fill = max > 0 ? Math.max(0, Math.min(value, max)) / max : 0;
  return (
    <div className={`vg-progress overflow-hidden ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <span className="vg-progress-fill" style={{ "--fill": fill } as CSSProperties} />
    </div>
  );
}

export function Tag({ tone, children }: { tone?: "orange" | "gold" | "red" | "green" | "dark"; children: ReactNode }) {
  return (
    <span className="vg-tag" data-tone={tone}>
      {children}
    </span>
  );
}
