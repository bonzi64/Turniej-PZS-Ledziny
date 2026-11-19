"use client";

import { CheckIcon, ChevronIcon } from "@/components/hx/icons";
import { formatClock, useRulesGate } from "@/components/module/RulesGate";
import { TabLink } from "@/components/module/TabLink";
import { EVENT } from "@/content/event";

// Droga do zapisu w czterech krokach – pierwszy pokazuje prawdziwy stan bramki regulaminu
export function HowToSteps({ closed }: { closed: boolean }) {
  const gate = useRulesGate();
  const steps = [
    {
      title: "Przeczytaj regulamin",
      note: gate.unlocked ? "Przeczytany – formularz jest odblokowany." : `Przewiń do końca, min. ${formatClock(gate.minSeconds)} lektury.`,
      done: gate.unlocked,
      tab: "regulamin",
    },
    { title: "Zgłoś drużynę", note: "5 graczy i rezerwowy: Riot ID, imię, nazwisko, klasa.", done: false, tab: "zapisy" },
    { title: "Poczekaj na zatwierdzenie", note: "Organizator sprawdzi zgłoszenie z listą uczniów.", done: false, tab: "druzyny" },
    { title: `Zagraj ${EVENT.dateLabel.slice(0, 5)}`, note: `Zbiórka ${EVENT.checkIn} w pracowni, start ${EVENT.kickoff}.`, done: false, tab: "drabinka" },
  ];

  return (
    <section aria-labelledby="howto-title" className="hx-frame flex flex-col p-5 md:col-span-2 xl:col-span-1" data-rule="">
      <h2 id="howto-title" className="hx-head">
        {closed ? "Jak to działało" : "Jak się zapisać"}
      </h2>
      <div className="hx-divider mt-2.5" data-align="start" aria-hidden />
      <ol className="mt-4 space-y-1">
        {steps.map((step, i) => (
          <li key={step.title}>
            <TabLink tab={step.tab} className="group ui-row flex items-start gap-3.5 px-2 py-2.5">
              <span
                aria-hidden
                className={`mt-0.5 grid size-7 shrink-0 rotate-45 place-items-center border ${step.done ? "border-teal bg-teal-dark text-teal-hi" : "border-bronze bg-void text-gold"}`}
              >
                <span className="-rotate-45 font-display text-[15px]">{step.done ? <CheckIcon size={13} /> : i + 1}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-parchment transition-colors group-hover:text-gold">{step.title}</span>
                <span className={`block text-[14px] ${step.done ? "text-teal" : "text-ui-muted"}`}>{step.note}</span>
              </span>
              <ChevronIcon size={14} className="mt-1 text-bronze transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-gold" />
            </TabLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
