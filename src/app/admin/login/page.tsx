import { redirect } from "next/navigation";
import { signIn } from "@/actions/staff-auth";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { PixelText } from "@/components/vgui/pixel";
import { Window } from "@/components/vgui/Window";
import { currentStaff } from "@/lib/auth/session";

export const metadata = { title: "Logowanie" };

export default async function LoginPage() {
  if (await currentStaff()) redirect("/admin");

  return (
    <div className="grid min-h-dvh place-items-center px-3">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-4 text-vg-gold">
          <SchoolLogo height={72} priority />
          <div>
            <PixelText text="PZS" dot={6} className="drop-shadow-[0_0_6px_rgb(196_181_80/0.45)]" />
            <p className="mt-2 text-[11px] tracking-[0.3em] text-vg-muted uppercase">Panel organizatora</p>
          </div>
        </div>
        <Window title="Logowanie – konto organizatora" closeHref="/">
          <p className="mb-3 text-[12px] text-vg-muted">Dostęp tylko dla nauczycieli-organizatorów. W panelu widać pełne dane uczniów.</p>
          <ActionForm action={signIn} className="space-y-3">
            <div>
              <label className="vg-label" htmlFor="login">
                Login
              </label>
              <input id="login" name="login" className="vg-field" autoComplete="username" required autoFocus />
            </div>
            <div>
              <label className="vg-label" htmlFor="password">
                Hasło
              </label>
              <input id="password" name="password" type="password" className="vg-field" autoComplete="current-password" required />
            </div>
            <div className="flex justify-end">
              <Submit className="min-w-24" data-default="">
                Zaloguj
              </Submit>
            </div>
          </ActionForm>
        </Window>
      </div>
    </div>
  );
}
