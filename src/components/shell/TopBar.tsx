"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { ExpandIcon, NoteIcon, SpeakerIcon } from "@/components/hx/icons";
import { openTab, useHash } from "@/components/hx/tab-store";
import { toggleFullscreen, useFullscreen } from "@/components/shell/fullscreen";
import { useSound } from "@/components/sound/SoundProvider";

export const HOME_TABS = ["info", "regulamin", "zapisy", "druzyny", "drabinka"] as const;

const NAV = [
  { id: "info", label: "Start" },
  { id: "regulamin", label: "Regulamin" },
  { id: "druzyny", label: "Drużyny" },
  { id: "drabinka", label: "Drabinka" },
] as const;

function useActive() {
  const pathname = usePathname();
  const hash = useHash();
  const home = pathname === "/";
  const tab = home ? ((HOME_TABS as readonly string[]).includes(hash) ? hash : "info") : null;
  return { pathname, home, tab };
}

// na stronie głównej zakładki przełączają się bez przeładowania; z podstron link prowadzi na /#zakładka
function useTabLink() {
  const { home } = useActive();
  return (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!home) return;
    event.preventDefault();
    openTab(id);
    window.scrollTo({ top: 0 });
  };
}

function NavItems() {
  const { pathname, tab } = useActive();
  const go = useTabLink();

  return (
    <>
      {NAV.map((item) => (
        <Link key={item.id} href={`/#${item.id}`} data-sfx="" onClick={go(item.id)} aria-current={tab === item.id ? "page" : undefined} className="hx-tab">
          {item.label}
        </Link>
      ))}
      <Link href="/zdjecia" data-sfx="" aria-current={pathname === "/zdjecia" ? "page" : undefined} className="hx-tab">
        Zdjęcia
      </Link>
    </>
  );
}

// pasek zakładek z jedną złotą kreską przesuwaną pod aktywną pozycję (transform, bez animowania szerokości)
function NavStrip({ className }: { className: string }) {
  const { pathname, tab } = useActive();
  const nav = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const key = `${pathname}#${tab ?? ""}`;

  const place = useCallback(() => {
    const root = nav.current;
    const line = bar.current;
    if (!root || !line) return;
    const active = root.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) {
      line.style.opacity = "0";
      return;
    }
    const inset = 12;
    const width = Math.max(0, active.offsetWidth - inset * 2);
    // pierwsze ustawienie bez przejazdu – kreska nie wyjeżdża z lewej krawędzi przy wejściu na stronę
    if (!placed.current) line.style.transition = "none";
    line.style.opacity = "1";
    line.style.transform = `translateX(${active.offsetLeft + inset}px) scaleX(${width / 100})`;
    if (!placed.current) {
      void line.offsetWidth;
      line.style.transition = "";
      placed.current = true;
    }
  }, []);

  useLayoutEffect(() => {
    place();
  }, [key, place]);

  useEffect(() => {
    const root = nav.current;
    if (!root) return;
    const observer = new ResizeObserver(() => place());
    observer.observe(root);
    document.fonts?.ready.then(() => place()).catch(() => {});
    return () => observer.disconnect();
  }, [place]);

  return (
    <nav ref={nav} aria-label="Menu turnieju" className={`relative ${className}`}>
      <NavItems />
      <span ref={bar} aria-hidden className="hx-tab-indicator" style={{ opacity: 0 }} />
    </nav>
  );
}

function SoundControls() {
  const { sfx, music, sfxVolume, musicVolume, toggleSfx, toggleMusic, setVolume, play } = useSound();
  const fullscreen = useFullscreen();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Dźwięk i ekran">
      <button
        type="button"
        data-sfx="mute"
        aria-pressed={sfx}
        aria-label={sfx ? "Wycisz efekty" : "Włącz efekty"}
        title={sfx ? "Wycisz efekty" : "Włącz efekty"}
        className="hx-icon-btn"
        onClick={() => {
          toggleSfx();
          if (!sfx) play("unlock");
        }}
      >
        <SpeakerIcon muted={!sfx} />
      </button>
      <button
        type="button"
        data-sfx="mute"
        aria-pressed={music}
        aria-label={music ? "Wycisz muzykę" : "Włącz muzykę"}
        title={music ? "Wycisz muzykę" : "Włącz muzykę"}
        className="hx-icon-btn"
        onClick={toggleMusic}
      >
        <NoteIcon muted={!music} />
      </button>

      <details className="group relative hidden sm:block">
        <summary data-sfx="" className="hx-icon-btn list-none font-display text-[11px] [&::-webkit-details-marker]:hidden" aria-label="Głośność" title="Głośność">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 3 V17 M10 3 V17 M16 3 V17" />
            <path d="M2 12 H6 M8 6 H12 M14 10 H18" strokeWidth="2.4" />
          </svg>
        </summary>
        <div className="hx-frame absolute top-11 right-0 z-50 w-60 px-4 py-3.5" data-rule="">
          <p className="hx-head text-[20px]">Głośność</p>
          {(
            [
              ["sfx", "Efekty", sfxVolume],
              ["music", "Muzyka", musicVolume],
            ] as const
          ).map(([channel, label, value]) => (
            <label key={channel} className="mt-3 block">
              <span className="flex justify-between text-[13px] text-ui-muted">
                {label}
                <span className="tabular">{Math.round(value * 100)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={value}
                onChange={(e) => setVolume(channel, Number(e.target.value))}
                onPointerUp={() => channel === "sfx" && play("tick")}
                className="hx-slider mt-1.5 w-full"
              />
            </label>
          ))}
        </div>
      </details>

      {fullscreen !== null && (
        <button
          type="button"
          data-sfx=""
          aria-pressed={fullscreen}
          aria-label={fullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
          title={fullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
          className="hx-icon-btn hidden md:grid"
          onClick={toggleFullscreen}
        >
          <ExpandIcon active={fullscreen} />
        </button>
      )}
    </div>
  );
}

export function TopBar() {
  const { tab } = useActive();
  const go = useTabLink();

  return (
    <header className="relative z-40 border-b border-umber bg-[linear-gradient(180deg,#0f1b2b_0%,#020b14_100%)] lg:sticky lg:top-0">
      <div className="flex h-16 items-center gap-3 pr-3 pl-2 sm:pr-5 sm:pl-3 lg:h-20">
        <div className="flex shrink-0 items-center">
          <Link href="/" data-sfx="" className="hx-ring relative z-10 -mr-3 size-12 lg:size-[60px]" aria-label="PZS E-sports – strona startowa">
            <SchoolLogo height={34} priority className="lg:h-10 lg:w-auto" />
          </Link>
          <Link href="/#zapisy" data-sfx="" onClick={go("zapisy")} aria-current={tab === "zapisy" ? "true" : undefined} className="hx-play h-10 pr-8 pl-7 text-[17px] sm:text-[19px] lg:h-[46px] lg:pr-10 lg:pl-10 lg:text-[22px]">
            Zapisz drużynę
          </Link>
        </div>

        <NavStrip className="ui-scroll hidden h-full min-w-0 flex-1 items-stretch overflow-x-auto pl-4 lg:flex" />

        <div className="ml-auto shrink-0">
          <SoundControls />
        </div>
      </div>

      <NavStrip className="ui-scroll flex h-12 snap-x snap-mandatory items-stretch overflow-x-auto border-t border-hull pr-8 [mask-image:linear-gradient(90deg,#000_82%,transparent)] lg:hidden [&>a]:snap-start [&>a]:px-3 [&>a]:text-[17px] [&>a]:tracking-[0.03em]" />
    </header>
  );
}
