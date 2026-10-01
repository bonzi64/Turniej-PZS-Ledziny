import { signOut } from "@/actions/staff-auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { PixelText } from "@/components/vgui/pixel";
import { requireStaff } from "@/lib/auth/session";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const staff = await requireStaff();

  return (
    <div className="min-h-dvh lg:pl-[17rem]">
      <aside className="fixed bottom-10 left-10 z-30 hidden w-56 lg:block">
        <nav aria-label="Panel organizatora">
          <AdminNav />
        </nav>
        <div className="mt-8 text-vg-gold">
          <div className="flex items-center gap-3">
            <SchoolLogo height={48} />
            <PixelText text="PZS" dot={5} className="drop-shadow-[0_0_6px_rgb(196_181_80/0.45)]" />
          </div>
          <p className="mt-2 text-[11px] text-vg-muted">
            {staff.displayName} · {staff.role === "ADMIN" ? "administrator" : "organizator"}
          </p>
          <form action={signOut} className="mt-2">
            <button data-sfx="" className="vg-btn">
              Wyloguj
            </button>
          </form>
        </div>
      </aside>

      <header className="vg-window sticky top-0 z-30 flex flex-wrap items-center gap-2 px-2 py-1.5 shadow-none lg:hidden">
        <AdminNav compact />
        <form action={signOut} className="ml-auto">
          <button data-sfx="" className="vg-btn">
            Wyloguj
          </button>
        </form>
      </header>

      <main className="mx-auto max-w-[1180px] space-y-4 px-2 py-4 sm:px-4 lg:py-10 lg:pr-6">{children}</main>
    </div>
  );
}
