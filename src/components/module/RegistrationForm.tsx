"use client";

import Link from "next/link";
import { type FormEvent, useActionState, useEffect, useRef, useState, useTransition } from "react";
import { registerTeam, type RegisterState } from "@/actions/register";
import { formatClock, useRulesGate } from "@/components/module/RulesGate";
import { TabLink } from "@/components/module/TabLink";
import { Chip, Dialog, Panel, Readout } from "@/components/skin/parts";
import { useSound } from "@/components/sound/SoundProvider";
import { RESERVE_SLOT } from "@/lib/tournament";

type Props = {
  slug: string;
  gameName: string;
  nickLabel: string;
  nickPlaceholder: string;
  closedReason: string | null;
};

const SLOTS = Array.from({ length: RESERVE_SLOT + 1 }, (_, slot) => slot);

function Hint({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-0.5 text-[12px] text-ui-danger">{message}</p>;
}

export function RegistrationForm({ slug, gameName, nickLabel, nickPlaceholder, closedReason }: Props) {
  const gate = useRulesGate();
  const [state, dispatch] = useActionState<RegisterState, FormData>(registerTeam, { status: "idle" });
  const [pending, startTransition] = useTransition();
  const [captain, setCaptain] = useState(0);
  const { play } = useSound();
  const topRef = useRef<HTMLDivElement>(null);

  const errors = state.status === "error" ? (state.fields ?? {}) : {};
  const err = (key: string) => errors[key];
  const errorStamp = state.status === "error" ? state.at : 0;

  useEffect(() => {
    if (state.status === "ok") play("success");
  }, [state.status, play]);

  useEffect(() => {
    if (!errorStamp) return;
    play("deny");
    topRef.current?.scrollIntoView({ block: "nearest" });
  }, [errorStamp, play]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gate.unlocked) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  if (closedReason) {
    return (
      <Dialog
        title="Zapisy zamknięte"
        tone="error"
        actions={
          <TabLink tab="druzyny" className="ui-btn min-w-20" data-default="">
            OK
          </TabLink>
        }
      >
        <p>{closedReason}</p>
      </Dialog>
    );
  }

  if (state.status === "ok") {
    return (
      <Dialog
        title="Zgłoszenie wysłane"
        actions={
          <TabLink tab="druzyny" className="ui-btn min-w-20" data-tone="gold" data-default="">
            OK
          </TabLink>
        }
      >
        <p className="ui-name text-[18px]">{state.teamName}</p>
        <p className="mt-2">
          Drużyna czeka na weryfikację przez organizatora ({gameName}). Po zatwierdzeniu pojawi się na liście drużyn.
        </p>
        <p className="mt-2 text-[12px] text-ui-faint">Publicznie widoczne będą wyłącznie nicki, nazwa drużyny i klasa.</p>
      </Dialog>
    );
  }

  if (!gate.unlocked) {
    return (
      <Dialog
        title="Formularz zablokowany"
        actions={
          <TabLink tab="regulamin" className="ui-btn min-w-32" data-tone="gold" data-default="">
            Otwórz regulamin
          </TabLink>
        }
      >
        <p>Zanim zgłosisz drużynę, przeczytaj regulamin do końca.</p>
        <div className="mt-4 flex justify-center">
          <Readout text={formatClock(Math.max(0, gate.minSeconds - gate.elapsed))} />
        </div>
        <p className="mt-3 text-[12px] text-ui-faint">
          {gate.scrolled ? "Regulamin przewinięty – jeszcze chwila lektury." : "Zegar liczy tylko przy otwartym regulaminie."}
        </p>
      </Dialog>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <form onSubmit={submit} noValidate className="space-y-6">
        <input type="hidden" name="game" value={slug} />
        <input type="hidden" name="ticket" value={gate.ticket} />
        <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label>
            Strona www
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {state.status === "error" && (
          <div key={state.at} role="alert" className="ui-inset flex animate-shake items-center gap-3 px-3 py-2 text-ui-danger">
            <Chip tone="red">Błąd</Chip>
            {state.message}
          </div>
        )}

        <Panel title="Drużyna">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_10rem]">
            <div>
              <label className="ui-label" htmlFor="teamName">
                Nazwa drużyny
              </label>
              <input id="teamName" name="teamName" className="ui-field" maxLength={28} placeholder="np. Czarne Koty" aria-invalid={Boolean(err("teamName"))} required />
              <Hint message={err("teamName")} />
            </div>
            <div>
              <label className="ui-label" htmlFor="teamTag">
                Tag (opcjonalnie)
              </label>
              <input id="teamTag" name="teamTag" className="ui-field uppercase" maxLength={5} placeholder="KOTY" aria-invalid={Boolean(err("teamTag"))} />
              <Hint message={err("teamTag")} />
            </div>
          </div>
        </Panel>

        <Panel title="Skład">
          <div className="ui-scroll ui-inset overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-[12px]">
              <thead>
                <tr className="ui-subhead text-left">
                  <th className="w-[4.5rem] px-2 py-1.5 font-normal">#</th>
                  <th className="px-2 py-1.5 font-normal">{nickLabel}</th>
                  <th className="px-2 py-1.5 font-normal">Imię</th>
                  <th className="px-2 py-1.5 font-normal">Nazwisko</th>
                  <th className="w-20 px-2 py-1.5 font-normal">Klasa</th>
                  <th className="w-16 px-2 py-1.5 text-center font-normal">Kapitan</th>
                </tr>
              </thead>
              <tbody>
                {SLOTS.map((slot) => {
                  const reserve = slot === RESERVE_SLOT;
                  const p = (key: string) => `p${slot}.${key}`;
                  const rowError = err(p("nick")) ?? err(p("first")) ?? err(p("last")) ?? err(p("class"));
                  return (
                    <tr key={slot} className={`align-top ${reserve ? "border-t border-dashed border-ui-faint/60" : ""}`}>
                      <td className="px-2 py-2 whitespace-nowrap text-ui-muted">
                        {reserve ? "Rez." : `Gracz ${slot + 1}`}
                        {reserve && <span className="block text-[10px] text-ui-faint">opcja</span>}
                      </td>
                      <td className="px-1 py-1">
                        <input name={p("nick")} aria-label={`${nickLabel}, ${reserve ? "rezerwowy" : `gracz ${slot + 1}`}`} className="ui-field" maxLength={32} placeholder={nickPlaceholder} aria-invalid={Boolean(err(p("nick")))} required={!reserve} />
                        {rowError && <Hint message={rowError} />}
                      </td>
                      <td className="px-1 py-1">
                        <input name={p("first")} aria-label="Imię" className="ui-field" maxLength={40} autoComplete="off" aria-invalid={Boolean(err(p("first")))} required={!reserve} />
                      </td>
                      <td className="px-1 py-1">
                        <input name={p("last")} aria-label="Nazwisko" className="ui-field" maxLength={40} autoComplete="off" aria-invalid={Boolean(err(p("last")))} required={!reserve} />
                      </td>
                      <td className="px-1 py-1">
                        <input name={p("class")} aria-label="Klasa" className="ui-field uppercase" maxLength={6} placeholder="2TI" aria-invalid={Boolean(err(p("class")))} required={!reserve} />
                      </td>
                      <td className="px-2 py-2 text-center">
                        {!reserve && (
                          <label className="inline-flex cursor-pointer items-center justify-center p-1.5" data-sfx="tick">
                            <input type="radio" name="captainSlot" value={slot} checked={captain === slot} onChange={() => setCaptain(slot)} className="peer sr-only" aria-label={`Kapitan: gracz ${slot + 1}`} />
                            <span className="ui-check ui-radio" />
                          </label>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-ui-faint">Klasa w formacie np. 2TI, 3A. Imiona i nazwiska zobaczy tylko organizator.</p>
        </Panel>

        <Panel title="Kontakt kapitana">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="ui-label" htmlFor="captainEmail">
                E-mail
              </label>
              <input id="captainEmail" name="captainEmail" type="email" className="ui-field" maxLength={120} placeholder="kapitan@example.com" aria-invalid={Boolean(err("captainEmail"))} required />
              <Hint message={err("captainEmail")} />
            </div>
            <div>
              <label className="ui-label" htmlFor="captainDiscord">
                Discord (opcjonalnie)
              </label>
              <input id="captainDiscord" name="captainDiscord" className="ui-field" maxLength={32} placeholder="nazwa_uzytkownika" aria-invalid={Boolean(err("captainDiscord"))} />
              <Hint message={err("captainDiscord")} />
            </div>
          </div>
        </Panel>

        <Panel title="Oświadczenia">
          <div className="space-y-3 text-[12px]">
            {[
              { name: "acceptRules", text: <>Akceptuję regulamin turnieju, w tym zasady fair play i rygor szkolny.</> },
              {
                name: "acceptPrivacy",
                text: (
                  <>
                    Wyrażam zgodę na przetwarzanie danych osobowych członków drużyny w celu organizacji turnieju zgodnie z{" "}
                    <Link href="/rodo" target="_blank" className="text-ui-accent underline">
                      klauzulą informacyjną
                    </Link>
                    .
                  </>
                ),
              },
              {
                name: "guardianConsent",
                text: <>Wszyscy zgłoszeni zawodnicy wiedzą o zgłoszeniu, a rodzice lub opiekunowie osób niepełnoletnich wyrazili zgodę na udział.</>,
              },
            ].map((item) => (
              <div key={item.name}>
                <label className="flex cursor-pointer items-start gap-2.5" data-sfx="tick">
                  <input type="checkbox" name={item.name} className="peer sr-only" required />
                  <span className="ui-check mt-0.5" aria-hidden>
                    ✓
                  </span>
                  <span>{item.text}</span>
                </label>
                <Hint message={err(item.name)} />
              </div>
            ))}
          </div>
        </Panel>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-ui-muted">Zgłoszenie zajmuje slot do decyzji organizatora.</p>
          <button type="submit" data-sfx="" data-tone="gold" disabled={pending} className="ui-btn min-h-8 min-w-44 text-[13px]">
            {pending ? "Wysyłanie..." : "Wyślij zgłoszenie"}
          </button>
        </div>
      </form>
    </div>
  );
}
