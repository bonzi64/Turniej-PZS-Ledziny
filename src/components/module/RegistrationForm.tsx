"use client";

import Link from "next/link";
import { type FormEvent, useActionState, useEffect, useRef, useState, useTransition } from "react";
import { registerTeam, type RegisterState } from "@/actions/register";
import { CrownIcon } from "@/components/hx/icons";
import { formatClock, useRulesGate } from "@/components/module/RulesGate";
import { TabLink } from "@/components/module/TabLink";
import { Avatar, Chip, Dialog, Panel, Readout } from "@/components/skin/parts";
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

// jedna siatka dla wiersza zawodnika: na telefonie karta (nagłówek + pola 2×2), od md wiersz tabeli
const ROW =
  "grid-cols-[1fr_auto] gap-x-3 gap-y-2.5 [grid-template-areas:'head_cap'_'fields_fields'] md:grid-cols-[10rem_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_5.5rem_4.5rem] md:gap-x-2 md:[grid-template-areas:'head_nick_first_last_class_cap']";

function Hint({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[13px] text-ui-danger">{message}</p>;
}

export function RegistrationForm({ slug, gameName, nickLabel, nickPlaceholder, closedReason }: Props) {
  const gate = useRulesGate();
  const [state, dispatch] = useActionState<RegisterState, FormData>(registerTeam, { status: "idle" });
  const [pending, startTransition] = useTransition();
  const [captain, setCaptain] = useState(0);
  // nicki wpisywane na żywo – portrety w składzie wypełniają się jak w lobby gry
  const [nicks, setNicks] = useState<string[]>(() => SLOTS.map(() => ""));
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
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
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
          <TabLink tab="druzyny" className="ui-btn min-w-32">
            Zobacz drużyny
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
          <TabLink tab="druzyny" className="ui-btn min-w-32" data-tone="gold">
            Zobacz drużyny
          </TabLink>
        }
      >
        <p className="ui-name text-[19px]">{state.teamName}</p>
        <p className="mt-3">Drużyna czeka na weryfikację przez organizatora ({gameName}). Po zatwierdzeniu pojawi się na liście drużyn i w panelu po prawej.</p>
        <p className="mt-3 text-[13px] text-ui-faint">Publicznie widoczne będą wyłącznie nicki, nazwa drużyny i klasa.</p>
      </Dialog>
    );
  }

  if (!gate.unlocked) {
    return (
      <Dialog
        title="Formularz zablokowany"
        actions={
          <TabLink tab="regulamin" className="ui-btn min-w-40" data-tone="gold">
            Otwórz regulamin
          </TabLink>
        }
      >
        <p>Zanim zgłosisz drużynę, przeczytaj regulamin do końca.</p>
        <div className="mt-5 flex justify-center">
          <Readout text={formatClock(Math.max(0, gate.minSeconds - gate.elapsed))} />
        </div>
        <p className="mt-3 text-[13px] text-ui-faint">
          {gate.scrolled ? "Regulamin przewinięty – jeszcze chwila lektury." : "Zegar liczy tylko przy otwartym regulaminie."}
        </p>
      </Dialog>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <form onSubmit={submit} noValidate className="space-y-5">
        <input type="hidden" name="game" value={slug} />
        <input type="hidden" name="ticket" value={gate.ticket} />
        <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label>
            Strona www
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {state.status === "error" && (
          <div key={state.at} role="alert" className="hx-frame flex animate-shake items-center gap-3 px-4 py-3 text-ui-danger">
            <Chip tone="red">Błąd</Chip>
            {state.message}
          </div>
        )}

        <Panel title="Drużyna">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_11rem]">
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

        <Panel title="Skład" aside={<span className="text-[13px] text-ui-muted">Kapitan jest osobą kontaktową</span>}>
          <div className={`hidden md:grid ${ROW} ui-subhead px-3 py-2`} aria-hidden>
            <span>Zawodnik</span>
            <span>{nickLabel}</span>
            <span>Imię</span>
            <span>Nazwisko</span>
            <span>Klasa</span>
            <span className="text-center">Kapitan</span>
          </div>

          <div className="divide-y divide-hull border-b border-hull">
            {SLOTS.map((slot) => {
              const reserve = slot === RESERVE_SLOT;
              const p = (key: string) => `p${slot}.${key}`;
              const who = reserve ? "rezerwowy" : `gracz ${slot + 1}`;
              const rowError = err(p("nick")) ?? err(p("first")) ?? err(p("last")) ?? err(p("class"));
              return (
                <div key={slot} role="group" aria-label={reserve ? "Rezerwowy" : `Gracz ${slot + 1}`} className={`grid ${ROW} px-3 py-4 md:py-2.5 ${reserve ? "bg-void/40" : ""}`}>
                  <div className="flex items-center gap-3 [grid-area:head] md:pt-0.5">
                    <span className="relative shrink-0">
                      {captain === slot && <CrownIcon size={18} className="absolute -top-3 left-1/2 z-10 -translate-x-1/2" />}
                      {nicks[slot].trim() ? (
                        <span key={nicks[slot].trim().slice(0, 2)} className="hx-ring size-10 animate-count-in">
                          <Avatar seed={nicks[slot].trim()} size={34} />
                        </span>
                      ) : (
                        <span className={`block size-10 rounded-full border border-dashed ${reserve ? "border-steel" : "border-bronze"}`} />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className={`font-display text-[20px] leading-none tracking-[0.03em] ${reserve ? "text-ui-muted" : "text-parchment"}`}>
                        {reserve ? "Rezerwowy" : `Gracz ${slot + 1}`}
                      </span>
                      {reserve && <span className="mt-1 text-[12px] text-ui-faint">opcjonalnie</span>}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 [grid-area:fields] md:contents">
                    <div className="col-span-2 md:[grid-area:nick]">
                      <label className="ui-label md:sr-only" htmlFor={p("nick")}>
                        {nickLabel}
                      </label>
                      <input id={p("nick")} name={p("nick")} aria-label={`${nickLabel}, ${who}`} onChange={(e) => {
                          const value = e.currentTarget.value;
                          setNicks((prev) => prev.map((n, i) => (i === slot ? value : n)));
                        }} className="ui-field" maxLength={32} placeholder={nickPlaceholder} aria-invalid={Boolean(err(p("nick")))} required={!reserve} />
                      <Hint message={rowError} />
                    </div>
                    <div className="md:[grid-area:first]">
                      <label className="ui-label md:sr-only" htmlFor={p("first")}>
                        Imię
                      </label>
                      <input id={p("first")} name={p("first")} aria-label={`Imię, ${who}`} className="ui-field" maxLength={40} autoComplete="off" aria-invalid={Boolean(err(p("first")))} required={!reserve} />
                    </div>
                    <div className="md:[grid-area:last]">
                      <label className="ui-label md:sr-only" htmlFor={p("last")}>
                        Nazwisko
                      </label>
                      <input id={p("last")} name={p("last")} aria-label={`Nazwisko, ${who}`} className="ui-field" maxLength={40} autoComplete="off" aria-invalid={Boolean(err(p("last")))} required={!reserve} />
                    </div>
                    <div className="col-span-2 sm:col-span-1 md:[grid-area:class]">
                      <label className="ui-label md:sr-only" htmlFor={p("class")}>
                        Klasa
                      </label>
                      <input id={p("class")} name={p("class")} aria-label={`Klasa, ${who}`} className="ui-field uppercase" maxLength={6} placeholder="2TI" aria-invalid={Boolean(err(p("class")))} required={!reserve} />
                    </div>
                  </div>

                  <div className="flex items-center justify-end [grid-area:cap] md:justify-center md:pt-1">
                    {!reserve && (
                      <label className="inline-flex cursor-pointer items-center gap-2 p-1.5" data-sfx="tick">
                        <input type="radio" name="captainSlot" value={slot} checked={captain === slot} onChange={() => setCaptain(slot)} className="peer sr-only" aria-label={`Kapitan: gracz ${slot + 1}`} />
                        <span className="ui-check ui-radio" aria-hidden />
                        <span className="text-[13px] text-ui-muted md:hidden">Kapitan</span>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[13px] text-ui-faint">Klasa w formacie np. 2TI, 3A. Imiona i nazwiska zobaczy tylko organizator.</p>
        </Panel>

        <Panel title="Kontakt kapitana">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="ui-label" htmlFor="captainEmail">
                E-mail
              </label>
              <input id="captainEmail" name="captainEmail" type="email" inputMode="email" autoComplete="email" className="ui-field" maxLength={120} placeholder="kapitan@example.com" aria-invalid={Boolean(err("captainEmail"))} required />
              <Hint message={err("captainEmail")} />
            </div>
            <div>
              <label className="ui-label" htmlFor="captainDiscord">
                Discord (opcjonalnie)
              </label>
              <input id="captainDiscord" name="captainDiscord" className="ui-field" maxLength={32} placeholder="nazwa_uzytkownika" autoCapitalize="off" aria-invalid={Boolean(err("captainDiscord"))} />
              <Hint message={err("captainDiscord")} />
            </div>
          </div>
        </Panel>

        <Panel title="Oświadczenia">
          <div className="space-y-3.5 text-[14px]">
            {[
              { name: "acceptRules", text: <>Akceptuję regulamin turnieju, w tym zasady fair play i regulamin pracowni.</> },
              {
                name: "acceptPrivacy",
                text: (
                  <>
                    Wyrażam zgodę na przetwarzanie danych osobowych członków drużyny w celu organizacji turnieju zgodnie z{" "}
                    <Link href="/rodo" target="_blank" className="text-gold underline hover:text-parchment">
                      klauzulą informacyjną
                    </Link>
                    .
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.name}>
                <label className="flex cursor-pointer items-start gap-3" data-sfx="tick">
                  <input type="checkbox" name={item.name} className="peer sr-only" required />
                  <span className="ui-check mt-0.5" aria-hidden />
                  <span className="text-parchment/90">{item.text}</span>
                </label>
                <Hint message={err(item.name)} />
              </div>
            ))}
          </div>
        </Panel>

        <div className="hx-frame flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <p className="text-[14px] text-ui-muted">Zgłoszenie zajmuje miejsce do decyzji organizatora.</p>
          <button type="submit" data-sfx="" data-tone="gold" data-size="lg" disabled={pending} className="ui-btn w-full sm:w-auto sm:min-w-56">
            {pending ? "Wysyłanie..." : "Wyślij zgłoszenie"}
          </button>
        </div>
      </form>
    </div>
  );
}
