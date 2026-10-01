"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { SoundDock } from "@/components/shell/SoundDock";
import { Emblem, PixelText } from "@/components/vgui/pixel";
import { openTab, useHash } from "@/components/vgui/tab-store";

export type MenuGame = { slug: string; name: string; short: string; vetoEnabled: boolean };

type Entry = { key: string; label: string; href: string; tab?: string; current?: boolean };

function useEntries(games: MenuGame[]): Entry[][] {
  const pathname = usePathname();
  const hash = useHash();
  const game = games.find((g) => pathname === `/${g.slug}` || pathname.startsWith(`/${g.slug}/`));

  if (game && pathname.startsWith(`/${game.slug}/veto`)) {
    return [
      [
        { key: "rooms", label: "Pokoje veto", href: `/${game.slug}#veto` },
        { key: "bracket", label: "Drabinka", href: `/${game.slug}#drabinka` },
        { key: "teams", label: "Drużyny", href: `/${game.slug}#druzyny` },
      ],
      [{ key: "back", label: "Wróć do modułu", href: `/${game.slug}` }],
    ];
  }

  if (game) {
    const tabs = [
      ["info", "Informacje"],
      ["regulamin", "Regulamin"],
      ["zapisy", "Zapisy"],
      ["druzyny", "Drużyny"],
      ["drabinka", "Drabinka"],
      ...(game.vetoEnabled ? [["veto", "Map veto"]] : []),
    ];
    const active = tabs.some(([id]) => id === hash) ? hash : "info";
    return [
      tabs.map(([id, label]) => ({ key: id, label, href: `/${game.slug}#${id}`, tab: id, current: id === active })),
      [
        ...(games.length > 1 ? [{ key: "switch", label: "Zmień grę", href: "/" }] : []),
        { key: "rodo", label: "Dane osobowe", href: "/rodo", current: pathname === "/rodo" },
      ],
    ];
  }

  return [
    games.map((g) => ({ key: g.slug, label: g.name, href: `/${g.slug}` })),
    [
      { key: "rodo", label: "Dane osobowe", href: "/rodo", current: pathname === "/rodo" },
      { key: "admin", label: "Panel organizatora", href: "/admin" },
    ],
  ];
}

function MenuList({ groups, onPick }: { groups: Entry[][]; onPick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      {groups.map((group, i) => (
        <ul key={i}>
          {group.map((entry) => (
            <li key={entry.key}>
              <Link
                href={entry.href}
                data-sfx=""
                aria-current={entry.current ? "true" : undefined}
                className="vg-menu-item"
                onClick={(event) => {
                  onPick?.();
                  if (entry.tab && pathname === entry.href.split("#")[0]) {
                    event.preventDefault();
                    openTab(entry.tab);
                    document.getElementById("okno")?.scrollIntoView({ block: "start" });
                  }
                }}
              >
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" data-sfx="" className="group flex items-center gap-4" aria-label="PZS E-sports – strona główna">
      <SchoolLogo height={64} className="drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)]" />
      <span>
        <PixelText text="PZS" dot={6} className="text-vg-gold drop-shadow-[0_0_6px_rgb(196_181_80/0.45)]" label="PZS" />
        <span className="mt-2 block text-[11px] tracking-[0.3em] text-vg-muted uppercase group-hover:text-vg-text">E-sports 2026</span>
      </span>
    </Link>
  );
}

export function SideMenu({ games }: { games: MenuGame[] }) {
  const groups = useEntries(games);
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Menu główne" className="fixed bottom-10 left-10 z-30 hidden w-60 lg:block">
        <MenuList groups={groups} />
        <div className="mt-10">
          <Logo />
        </div>
      </nav>

      <div className="absolute top-3 right-3 z-40 hidden lg:block">
        <SoundDock />
      </div>

      <header className="vg-window fixed inset-x-0 top-0 z-40 flex h-11 items-center gap-2 px-2 shadow-none lg:hidden">
        <button type="button" data-sfx="" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)} className="vg-btn">
          <Emblem className="text-vg-gold" size={12} />
          Menu
        </button>
        <Link href="/" className="ml-1 flex items-center gap-2 text-vg-gold" aria-label="Strona główna">
          <SchoolLogo height={28} />
          <PixelText text="PZS" dot={3} />
        </Link>
        <div className="ml-auto">
          <SoundDock compact />
        </div>
      </header>

      {open && (
        <nav id="menu-mobile" aria-label="Menu główne" className="vg-window fixed inset-x-2 top-12 z-40 px-5 py-4 lg:hidden">
          <MenuList groups={groups} onPick={() => setOpen(false)} />
        </nav>
      )}
    </>
  );
}
