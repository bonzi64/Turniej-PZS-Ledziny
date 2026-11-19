"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Pulpit" },
  { href: "/admin/druzyny", label: "Zgłoszenia" },
  { href: "/admin/drabinka", label: "Drabinka" },
  { href: "/admin/zdjecia", label: "Zdjęcia" },
  { href: "/admin/konta", label: "Konta" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} data-sfx="" aria-current={active ? "page" : undefined} className="hx-tab">
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
