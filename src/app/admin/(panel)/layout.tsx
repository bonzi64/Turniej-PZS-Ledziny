import Link from "next/link";
import { signOut } from "@/actions/staff-auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { ArrowOutIcon } from "@/components/hx/icons";
import { requireStaff } from "@/lib/auth/session";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const staff = await requireStaff();

  return (
    <div className="min-h-dvh">
      <header className="relative z-30 border-b border-umber bg-[linear-gradient(180deg,#0f1b2b_0%,#020b14_100%)] lg:sticky lg:top-0">
        <div className="flex h-16 items-center gap-4 px-3 sm:px-5">
          <Link href="/admin" data-sfx="" className="flex shrink-0 items-center gap-3" aria-label="Pulpit organizatora">
            <span className="hx-ring size-11">
              <SchoolLogo height={30} />
            </span>
            <span className="hidden font-display text-[19px] leading-[0.95] tracking-[0.03em] text-parchment sm:block">
              Panel
              <br />
              <span className="text-gold">organizatora</span>
            </span>
          </Link>

          <nav aria-label="Panel organizatora" className="ui-scroll hidden h-full min-w-0 flex-1 items-stretch overflow-x-auto pl-2 md:flex">
            <AdminNav />
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <p className="hidden text-right text-[13px] leading-tight lg:block">
              <span className="block text-parchment">{staff.displayName}</span>
              <span className="text-ui-muted">{staff.role === "ADMIN" ? "administrator" : "organizator"}</span>
            </p>
            <Link href="/" data-sfx="" className="hx-icon-btn" aria-label="Strona turnieju" title="Strona turnieju">
              <ArrowOutIcon size={15} />
            </Link>
            <form action={signOut}>
              <button data-sfx="" data-size="sm" className="ui-btn">
                Wyloguj
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Panel organizatora" className="ui-scroll flex h-12 items-stretch overflow-x-auto border-t border-hull md:hidden">
          <AdminNav />
        </nav>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-3 py-5 sm:px-5 lg:py-8">{children}</main>
    </div>
  );
}
