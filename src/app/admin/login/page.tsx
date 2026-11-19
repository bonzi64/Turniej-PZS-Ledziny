import { redirect } from "next/navigation";
import { signIn } from "@/actions/staff-auth";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { SchoolLogo } from "@/components/brand/SchoolLogo";
import { Window } from "@/components/hx/frame";
import { currentStaff } from "@/lib/auth/session";

export const metadata = { title: "Logowanie" };

export default async function LoginPage() {
  if (await currentStaff()) redirect("/admin");

  return (
    <div className="grid min-h-dvh place-items-center px-3 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="hx-ring size-28">
            <SchoolLogo height={72} priority />
          </span>
          <h1 className="mt-5 font-display text-[38px] tracking-[0.02em] text-parchment">Panel organizatora</h1>
          <p className="mt-1 text-[14px] text-ui-muted">Turniej PZS Lędziny · League of Legends</p>
        </div>
        <Window title="Logowanie" closeHref="/">
          <p className="mb-4 text-[14px] text-ui-muted">Dostęp tylko dla nauczycieli-organizatorów. W panelu widać pełne dane uczniów.</p>
          <ActionForm action={signIn} className="space-y-4">
            <div>
              <label className="ui-label" htmlFor="login">
                Login
              </label>
              <input id="login" name="login" className="ui-field" autoComplete="username" autoCapitalize="off" required autoFocus />
            </div>
            <div>
              <label className="ui-label" htmlFor="password">
                Hasło
              </label>
              <input id="password" name="password" type="password" className="ui-field" autoComplete="current-password" required />
            </div>
            <Submit tone="gold" className="w-full">
              Zaloguj
            </Submit>
          </ActionForm>
        </Window>
      </div>
    </div>
  );
}
