"use client";

import { createContext, type ReactNode, use, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TabLink } from "@/components/module/TabLink";
import { LockIcon } from "@/components/hx/icons";
import { Panel, Readout } from "@/components/skin/parts";
import { useSound } from "@/components/sound/SoundProvider";

// --- STAN BRAMKI ---

type Gate = {
  unlocked: boolean;
  ticket: string;
  scrolled: boolean;
  progress: number;
  reportScroll: (progress: number) => void;
};

const GateContext = createContext<Gate | null>(null);

const noopSubscribe = () => () => {};

export function RulesProvider({ slug, ticket, children }: { slug: string; ticket: string; children: ReactNode }) {
  const storageKey = `pzs.rules.${slug}`;
  const remembered = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return sessionStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    () => null,
  );

  const [progress, setProgress] = useState(0);
  const { play } = useSound();

  const earned = progress >= 0.98;
  const unlocked = earned || remembered !== null;
  const announced = useRef(false);
  const reportScroll = useCallback((value: number) => setProgress((prev) => Math.max(prev, value)), []);

  useEffect(() => {
    if (!earned || announced.current) return;
    announced.current = true;
    play("unlock");
    try {
      sessionStorage.setItem(storageKey, ticket);
    } catch {}
  }, [earned, play, storageKey, ticket]);

  const gate: Gate = {
    unlocked,
    // bilet z pierwszego czytania – po odświeżeniu nie trzeba przewijać drugi raz
    ticket: remembered ?? ticket,
    scrolled: unlocked,
    progress: unlocked ? 1 : progress,
    reportScroll,
  };

  return <GateContext value={gate}>{children}</GateContext>;
}

export function useRulesGate() {
  const gate = use(GateContext);
  if (!gate) throw new Error("useRulesGate poza <RulesProvider>");
  return gate;
}

// --- WIDOK ---

function Check({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="ui-check mt-0.5" data-on={done ? "" : undefined} aria-hidden />
      <span className={done ? "text-parchment" : "text-ui-muted"}>{children}</span>
    </li>
  );
}

export function RulesGate({ children }: { children: ReactNode }) {
  const gate = useRulesGate();
  const scroller = useRef<HTMLDivElement>(null);
  const { reportScroll } = gate;

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;

    const measure = () => {
      if (node.clientHeight === 0) return;
      const room = node.scrollHeight - node.clientHeight;
      reportScroll(room <= 8 ? 1 : node.scrollTop / room);
    };

    const resize = new ResizeObserver(measure);
    resize.observe(node);
    node.addEventListener("scroll", measure, { passive: true });

    return () => {
      resize.disconnect();
      node.removeEventListener("scroll", measure);
    };
  }, [reportScroll]);

  const pct = Math.round(gate.progress * 100);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="hx-frame">
        <div className="flex items-center justify-between border-b border-hull px-5 py-3 text-[13px] text-ui-muted">
          <span className="font-display tracking-[0.05em] text-gold">Regulamin turnieju</span>
          <span className="tabular">przeczytano {pct}%</span>
        </div>
        <div className="hx-meter border-x-0 border-t-0">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div ref={scroller} tabIndex={0} aria-label="Treść regulaminu" className="ui-scroll h-[26rem] overflow-y-auto px-5 py-5 sm:h-[32rem] sm:px-7">
          {children}
        </div>
      </div>

      <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <Panel title="Odblokowanie zapisów">
          <div className="flex justify-center py-1">
            <Readout text={`${pct}%`} label={`Przeczytano ${pct}%`} />
          </div>

          <ul className="mt-5 space-y-2.5 text-[14px]">
            <Check done={gate.scrolled}>Regulamin przewinięty do końca</Check>
          </ul>

          <p className="mt-4 text-[13px] text-ui-faint">Formularz odblokuje się, gdy dojdziesz do końca regulaminu.</p>
        </Panel>

        <div className="hx-frame px-5 py-4">
          <p className={`flex items-center gap-2 font-display text-[19px] tracking-[0.03em] ${gate.unlocked ? "text-teal" : "text-ui-muted"}`}>
            <LockIcon open={gate.unlocked} size={15} />
            {gate.unlocked ? "Formularz odblokowany" : "Formularz zablokowany"}
          </p>
          <TabLink tab="zapisy" className="ui-btn mt-3.5 w-full" data-tone={gate.unlocked ? "gold" : undefined}>
            Przejdź do zapisów
          </TabLink>
        </div>
      </div>
    </div>
  );
}
