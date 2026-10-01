"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Pulpit" },
  { href: "/admin/druzyny", label: "Zgłoszenia" },
  { href: "/admin/drabinka", label: "Drabinka i PIN-y" },
  { href: "/admin/konta", label: "Konta" },
  { href: "/", label: "Strona turnieju" },
];

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <ul className={compact ? "flex flex-wrap gap-1" : ""}>
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : link.href !== "/" && pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              data-sfx=""
              aria-current={active ? "page" : undefined}
              className={compact ? "vg-btn" : "vg-menu-item"}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
