"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { TabLink } from "@/components/module/TabLink";
import { Meter, Panel, Readout } from "@/components/skin/parts";
import { useSound } from "@/components/sound/SoundProvider";

// --- STAN BRAMKI ---

type Gate = {
  unlocked: boolean;
  ticket: string;
  elapsed: number;
  minSeconds: number;
  scrolled: boolean;
  progress: number;
  reportScroll: (progress: number) => void;
  setWatching: (watching: boolean) => void;
};

const GateContext = createContext<Gate | null>(null);

const noopSubscribe = () => () => {};

export function RulesProvider({
  slug,
  ticket,
  minSeconds,
  children,
}: {
  slug: string;
  ticket: string;
  minSeconds: number;
  children: ReactNode;
}) {
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

  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [watching, setWatching] = useState(false);
  const { play } = useSound();

  const scrolled = progress >= 0.98;
  const earned = elapsed >= minSeconds && scrolled;
  const unlocked = earned || remembered !== null;
  const announced = useRef(false);
  const reportScroll = useCallback((value: number) => setProgress((prev) => Math.max(prev, value)), []);

  useEffect(() => {
    if (unlocked || !watching) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [unlocked, watching]);

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
    // bilet z pierwszego czytania – po odświeżeniu nie trzeba czekać drugi raz
    ticket: remembered ?? ticket,
    elapsed: unlocked ? Math.max(elapsed, minSeconds) : elapsed,
    minSeconds,
    scrolled: unlocked || scrolled,
    progress: unlocked ? 1 : progress,
    reportScroll,
    setWatching,
  };

  return <GateContext value={gate}>{children}</GateContext>;
}

export function useRulesGate() {
  const gate = use(GateContext);
  if (!gate) throw new Error("useRulesGate poza <RulesProvider>");
  return gate;
}

export const formatClock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

// --- WIDOK ---

function Check({ done, children }: { done: boolean; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="ui-check mt-0.5" data-on={done ? "" : undefined} aria-hidden>
        ✓
      </span>
      <span className={done ? "" : "text-ui-muted"}>{children}</span>
    </li>
  );
}

export function RulesGate({ children }: { children: ReactNode }) {
  const gate = useRulesGate();
  const scroller = useRef<HTMLDivElement>(null);
  const { reportScroll, setWatching } = gate;

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;

    const measure = () => {
      if (node.clientHeight === 0) return;
      const room = node.scrollHeight - node.clientHeight;
      reportScroll(room <= 8 ? 1 : node.scrollTop / room);
    };

    const observer = new IntersectionObserver(([entry]) => setWatching(entry.isIntersecting), { threshold: 0.3 });
    const resize = new ResizeObserver(measure);
    observer.observe(node);
    resize.observe(node);
    node.addEventListener("scroll", measure, { passive: true });

    return () => {
      observer.disconnect();
      resize.disconnect();
      node.removeEventListener("scroll", measure);
    };
  }, [reportScroll, setWatching]);

  const timeLeft = Math.max(0, gate.minSeconds - gate.elapsed);
  const pct = Math.round(gate.progress * 100);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[12px] text-ui-muted">
          <span>regulamin.txt</span>
          <span className="tabular">przeczytano {pct}%</span>
        </div>
        <div
          ref={scroller}
          tabIndex={0}
          aria-label="Treść regulaminu"
          className="ui-inset ui-scroll h-[26rem] overflow-y-auto px-4 py-3 sm:h-[30rem]"
        >
          {children}
        </div>
      </div>

      <div className="space-y-5">
        <Panel title="Odblokowanie zapisów">
          <div className="flex justify-center">
            <Readout text={formatClock(timeLeft)} label={`Pozostało ${timeLeft} s`} />
          </div>
          <Meter value={gate.elapsed} max={gate.minSeconds} className="mt-3" />

          <ul className="mt-4 space-y-2 text-[13px]">
            <Check done={gate.elapsed >= gate.minSeconds}>Czas lektury min. {formatClock(gate.minSeconds)}</Check>
            <Check done={gate.scrolled}>Regulamin przewinięty do końca</Check>
          </ul>

          <p className="mt-3 text-[12px] text-ui-faint">Zegar liczy tylko wtedy, gdy regulamin jest widoczny na ekranie.</p>
        </Panel>

        <div className="ui-card px-4 py-3">
          <p className={`font-bold ${gate.unlocked ? "text-ui-ok" : "text-ui-danger"}`}>{gate.unlocked ? "Formularz odblokowany" : "Formularz zablokowany"}</p>
          <TabLink tab="zapisy" className="ui-btn mt-2.5 w-full" data-tone={gate.unlocked ? "gold" : undefined} data-default="">
            Przejdź do zapisów
          </TabLink>
        </div>
      </div>
    </div>
  );
}
