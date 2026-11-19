import Link from "next/link";
import type { ReactNode } from "react";
import { CloseIcon } from "@/components/hx/icons";
import { Chip, Meter } from "@/components/skin/parts";

// Okna i grupy w stylu klienta LoL – wspólne dla podstron i panelu organizatora

export function CloseBox({ href }: { href: string }) {
  return (
    <Link href={href} data-sfx="" aria-label="Zamknij" className="hx-icon-btn ml-auto size-8">
      <CloseIcon size={14} />
    </Link>
  );
}

type WindowProps = {
  title: string;
  children: ReactNode;
  closeHref?: string;
  status?: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
};

export function Window({ title, children, closeHref, status, className = "", bodyClassName = "px-4 pb-5 sm:px-6", id }: WindowProps) {
  return (
    <section id={id} aria-label={title} className={`hx-frame ${className}`}>
      <header className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-6">
        <h2 className="hx-head min-w-0 truncate">{title}</h2>
        {closeHref && <CloseBox href={closeHref} />}
      </header>
      <div className="hx-divider mx-4 mb-4 sm:mx-6" data-align="start" aria-hidden />
      <div className={bodyClassName}>{children}</div>
      {status && (
        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-hull bg-void/60 px-4 py-2 text-[13px] text-ui-muted sm:px-6">{status}</footer>
      )}
    </section>
  );
}

export function Group({ legend, children, className = "" }: { legend?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`ui-card p-4 ${className}`}>
      {legend && <p className="mb-3 font-display text-[15px] tracking-[0.05em] text-gold">{legend}</p>}
      {children}
    </div>
  );
}

export function Tag({ tone, children }: { tone?: "orange" | "gold" | "red" | "green" | "dark"; children: ReactNode }) {
  return <Chip tone={tone}>{children}</Chip>;
}

export function Progress({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  return <Meter value={value} max={max} className={className} />;
}

// nagłówek podstrony: tytuł w wersalikach klienta i krótki opis pod nim
export function PageHead({ title, children, aside }: { title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-[34px] leading-[1.05] tracking-[0.03em] text-parchment text-balance sm:text-[44px]">{title}</h1>
          {children && <div className="mt-2 max-w-2xl text-[15px] text-ui-muted">{children}</div>}
        </div>
        {aside}
      </div>
      <div className="hx-divider mt-5" data-align="start" aria-hidden />
    </header>
  );
}
