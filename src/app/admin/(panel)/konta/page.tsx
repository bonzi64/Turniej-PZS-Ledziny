import { changeOwnPassword, createStaff, removeStaff, resetStaffPassword } from "@/actions/admin-staff";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { dateTime } from "@/components/admin/bits";
import { Identicon } from "@/components/vgui/pixel";
import { Group, Tag, Window } from "@/components/vgui/Window";
import { staffList } from "@/lib/admin-queries";
import { PASSWORD_MIN } from "@/lib/auth/password";
import { requireStaff } from "@/lib/auth/session";

export const metadata = { title: "Konta" };

export default async function Accounts() {
  const me = await requireStaff();
  const staff = me.role === "ADMIN" ? await staffList() : [];

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <Window title="Konta organizatorów">
        {me.role === "ADMIN" ? (
          <div className="space-y-5">
            <ul className="space-y-1.5">
              {staff.map((person) => (
                <li key={person.id} className="vg-deep flex flex-wrap items-center gap-3 px-2 py-2 text-[12px]">
                  <Identicon seed={person.login} size={24} />
                  <div className="min-w-44 flex-1">
                    <p className="font-bold">
                      {person.displayName} {person.id === me.id && <Tag tone="gold">Ty</Tag>}
                    </p>
                    <p className="text-vg-muted">
                      {person.login} · {person.role === "ADMIN" ? "administrator" : "organizator"} · ostatnio{" "}
                      {person.lastLoginAt ? dateTime.format(person.lastLoginAt) : "nigdy"}
                    </p>
                  </div>
                  {person.id !== me.id && (
                    <>
                      <ActionForm action={resetStaffPassword} className="flex flex-wrap items-center gap-1.5">
                        <input type="hidden" name="staffId" value={person.id} />
                        <input name="password" type="password" minLength={PASSWORD_MIN} placeholder="nowe hasło" className="vg-field w-36" autoComplete="new-password" aria-label="Nowe hasło" />
                        <Submit>Ustaw hasło</Submit>
                      </ActionForm>
                      <ActionForm action={removeStaff} className="flex flex-wrap gap-1.5">
                        <input type="hidden" name="staffId" value={person.id} />
                        <Submit tone="danger" confirm="Usunąć konto?">
                          Usuń
                        </Submit>
                      </ActionForm>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <Group legend="Nowe konto">
              <ActionForm action={createStaff} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="vg-label" htmlFor="new-login">
                    Login
                  </label>
                  <input id="new-login" name="login" className="vg-field" placeholder="j.kowalski" autoComplete="off" required />
                </div>
                <div>
                  <label className="vg-label" htmlFor="new-name">
                    Imię i nazwisko
                  </label>
                  <input id="new-name" name="displayName" className="vg-field" required />
                </div>
                <div>
                  <label className="vg-label" htmlFor="new-password">
                    Hasło startowe (min. {PASSWORD_MIN})
                  </label>
                  <input id="new-password" name="password" type="password" minLength={PASSWORD_MIN} className="vg-field" autoComplete="new-password" required />
                </div>
                <div>
                  <label className="vg-label" htmlFor="new-role">
                    Rola
                  </label>
                  <select id="new-role" name="role" className="vg-field">
                    <option value="ORGANIZER">Organizator – zgłoszenia i drabinka</option>
                    <option value="ADMIN">Administrator – także konta i RODO</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Submit tone="gold">Utwórz konto</Submit>
                </div>
              </ActionForm>
            </Group>
          </div>
        ) : (
          <p className="text-vg-muted">Zarządzanie kontami jest dostępne dla administratorów. Obok możesz zmienić własne hasło.</p>
        )}
      </Window>

      <Window title="Moje hasło">
        <ActionForm action={changeOwnPassword} className="space-y-2.5">
          <div>
            <label className="vg-label" htmlFor="pw-current">
              Obecne hasło
            </label>
            <input id="pw-current" name="current" type="password" className="vg-field" autoComplete="current-password" required />
          </div>
          <div>
            <label className="vg-label" htmlFor="pw-next">
              Nowe hasło
            </label>
            <input id="pw-next" name="next" type="password" minLength={PASSWORD_MIN} className="vg-field" autoComplete="new-password" required />
          </div>
          <div>
            <label className="vg-label" htmlFor="pw-repeat">
              Powtórz
            </label>
            <input id="pw-repeat" name="repeat" type="password" minLength={PASSWORD_MIN} className="vg-field" autoComplete="new-password" required />
          </div>
          <div className="flex justify-end">
            <Submit tone="gold">Zmień hasło</Submit>
          </div>
        </ActionForm>
      </Window>
    </div>
  );
}
