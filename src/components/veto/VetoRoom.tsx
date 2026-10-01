"use client";

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { banOrPick, enterCaptainPin, leaveCaptainSeat } from "@/actions/veto";
import { useSound } from "@/components/sound/SoundProvider";
import { MapTile, type TileState } from "@/components/veto/MapTile";
import { Identicon, PixelText } from "@/components/vgui/pixel";
import { Group, Progress, Tag } from "@/components/vgui/Window";
import type { Side } from "@/generated/prisma/enums";
import { useNow } from "@/hooks/useNow";
import type { ActionResult } from "@/lib/action-result";
import { ACTIVE_DUTY, mapById } from "@/lib/veto/maps";
import { VETO_ORDER } from "@/lib/veto/sequence";
import type { VetoSnapshot } from "@/lib/veto/service";

// --- FEED ---

function useVetoFeed(initial: VetoSnapshot) {
  const [feed, setFeed] = useState({ snap: initial, skew: 0 });
  const busy = useRef(false);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const res = await fetch(`/api/veto/${initial.matchId}`, { cache: "no-store" });
      if (res.ok) {
        const snap = (await res.json()) as VetoSnapshot;
        setFeed({ snap, skew: Date.parse(snap.serverNow) - Date.now() });
      }
    } catch {
    } finally {
      busy.current = false;
    }
  }, [initial.matchId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const loop = async () => {
      await refresh();
      if (alive) timer = setTimeout(loop, document.visibilityState === "visible" ? 1500 : 6000);
    };
    timer = setTimeout(loop, 1200);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [refresh]);

  return [feed, refresh] as const;
}

// --- KAWAŁKI ---

const teamName = (snap: VetoSnapshot, side: Side | null) => (side ? (snap.teams[side]?.name ?? `Drużyna ${side}`) : "System");

function TeamPlate({ snap, side, active }: { snap: VetoSnapshot; side: Side; active: boolean }) {
  const team = snap.teams[side];
  return (
    <div className={`flex items-center gap-3 p-2.5 ${side === "B" ? "flex-row-reverse text-right" : ""} ${active ? "bg-vg-select/40 outline-1 outline-vg-gold" : "vg-panel"}`}>
      <Identicon seed={team?.name ?? side} size={44} />
      <div className="min-w-0">
        <p className="text-[11px] text-vg-muted">
          Drużyna {side} {snap.viewer === side && <Tag tone="gold">Ty</Tag>}
        </p>
        <p className="truncate text-[17px] leading-tight font-bold text-vg-gold text-emboss">{team?.name ?? "TBD"}</p>
        <p className="text-[11px] text-vg-muted">{team?.classes.join(" / ") || "—"}</p>
        <p className={`mt-0.5 text-[11px] ${snap.ready[side] ? "text-vg-green" : "text-vg-faint"}`}>
          {snap.ready[side] ? "● kapitan w pokoju" : "○ czeka na kapitana"}
        </p>
      </div>
    </div>
  );
}

function CaptainDock({ snap, onChange }: { snap: VetoSnapshot; onChange: () => void }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(enterCaptainPin, null);
  const [leaving, startLeaving] = useTransition();
  const { play } = useSound();

  useEffect(() => {
    if (!state) return;
    play(state.ok ? "unlock" : "deny");
    if (state.ok) onChange();
  }, [state, play, onChange]);

  if (snap.viewer) {
    return (
      <Group legend="Panel kapitana">
        <p className="font-bold text-vg-gold">{teamName(snap, snap.viewer)}</p>
        <p className="mt-1 text-[12px] text-vg-muted">
          {snap.phase === "LOBBY" ? "Czekamy na drugiego kapitana – zegar ruszy, gdy obaj będziecie w pokoju." : "W swojej turze zaznacz mapę i potwierdź ruch."}
        </p>
        <button
          type="button"
          data-sfx=""
          disabled={leaving}
          onClick={() =>
            startLeaving(async () => {
              await leaveCaptainSeat(snap.matchId);
              onChange();
            })
          }
          className="vg-btn mt-3"
        >
          Wyloguj kapitana
        </button>
      </Group>
    );
  }

  if (snap.phase === "DONE") return null;

  return (
    <Group legend="Logowanie kapitana">
      <form action={action}>
        <input type="hidden" name="matchId" value={snap.matchId} />
        <label htmlFor="pin" className="vg-label">
          PIN od organizatora
        </label>
        <div className="flex gap-1.5">
          <input
            id="pin"
            name="pin"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="000000"
            disabled={snap.phase === "LOCKED"}
            className="vg-field min-w-0 flex-1 text-center text-[16px] tracking-[0.4em] tabular"
          />
          <button type="submit" data-sfx="" data-default="" disabled={pending || snap.phase === "LOCKED"} className="vg-btn min-w-16">
            {pending ? "..." : "Wejdź"}
          </button>
        </div>
        {state && !state.ok && <p className="mt-1.5 text-[11px] text-[#ff9f8a]">{state.message}</p>}
        <p className="mt-2 text-[11px] text-vg-faint">{snap.phase === "LOCKED" ? "Organizator nie wydał jeszcze PIN-ów." : "Widzowie nie muszą się logować."}</p>
      </form>
    </Group>
  );
}

// --- POKÓJ ---

export function VetoRoom({ initial }: { initial: VetoSnapshot }) {
  const [{ snap, skew }, refresh] = useVetoFeed(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<{ text: string; at: number } | null>(null);
  const [pending, startTransition] = useTransition();
  const now = useNow();
  const { play } = useSound();
  const heard = useRef(initial.steps.length);

  useEffect(() => {
    const fresh = snap.steps.slice(heard.current);
    heard.current = snap.steps.length;
    if (fresh.length === 0) return;
    const loudest = fresh.find((s) => s.action === "BAN") ?? fresh[0];
    play(loudest.action === "BAN" ? "ban" : "pick");
  }, [snap.steps, play]);

  const stepByMap = new Map(snap.steps.map((s) => [s.map, s]));
  const myTurn = snap.phase === "LIVE" && snap.turn !== null && snap.turn.side === snap.viewer;
  const choice = selected && !stepByMap.has(selected) && myTurn ? selected : null;
  const moves = VETO_ORDER[snap.format].length;

  const secondsLeft =
    snap.turn?.endsAt && now !== null ? Math.max(0, Math.ceil((Date.parse(snap.turn.endsAt) - (now + skew)) / 1000)) : null;

  const confirm = () => {
    if (!choice) return;
    startTransition(async () => {
      const result = await banOrPick(snap.matchId, choice);
      if (!result.ok) {
        setError({ text: result.message, at: Date.now() });
        play("deny");
      } else {
        setError(null);
      }
      setSelected(null);
      await refresh();
    });
  };

  const tileState = (mapId: string): { state: TileState; mark?: string; order?: number; auto?: boolean } => {
    const step = stepByMap.get(mapId);
    if (!step) return { state: "open" };
    if (step.action === "DECIDER") return { state: "decider", mark: "Decider", order: step.order };
    const who = snap.teams[step.side ?? "A"]?.tag ?? teamName(snap, step.side);
    return { state: step.action === "BAN" ? "ban" : "pick", mark: `${step.action} · ${who}`, order: step.order, auto: step.auto };
  };

  const banner = (() => {
    switch (snap.phase) {
      case "LOCKED":
        return "Pokój zamknięty – organizator nie wydał jeszcze PIN-ów.";
      case "LOBBY":
        return "Lobby – czekamy na obu kapitanów.";
      case "DONE":
        return "Veto zakończone – mapy ustalone.";
      default:
        if (!snap.turn) return "...";
        if (myTurn) return `Twoja tura – ${snap.turn.action === "BAN" ? "zbanuj" : "wybierz"} mapę.`;
        return `${teamName(snap, snap.turn.side)} ${snap.turn.action === "BAN" ? "banuje" : "wybiera"} mapę...`;
    }
  })();

  const finalMaps = snap.steps.filter((s) => s.action !== "BAN");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)]">
        <TeamPlate snap={snap} side="A" active={snap.phase === "LIVE" && snap.turn?.side === "A"} />
        <div className="vg-deep flex flex-col items-center justify-center gap-1 px-3 py-2">
          {snap.phase === "LIVE" && snap.turn ? (
            <>
              <span className="text-[10px] text-vg-muted">
                ruch {snap.turn.order + 1}/{moves}
              </span>
              <span className={secondsLeft !== null && secondsLeft <= 10 ? "animate-blink text-vg-red" : "text-vg-gold"}>
                <PixelText text={secondsLeft === null ? "--" : String(secondsLeft).padStart(2, "0")} dot={7} ghost label={`${secondsLeft ?? 0} sekund`} />
              </span>
              <Tag tone={snap.turn.action === "BAN" ? "red" : "gold"}>{snap.turn.action}</Tag>
            </>
          ) : (
            <span className="text-vg-muted">
              <PixelText text="VS" dot={7} />
            </span>
          )}
        </div>
        <TeamPlate snap={snap} side="B" active={snap.phase === "LIVE" && snap.turn?.side === "B"} />
      </div>

      <div className="vg-panel flex items-center gap-3 px-3 py-2" aria-live="polite">
        <Tag tone={snap.phase === "LIVE" ? "red" : snap.phase === "DONE" ? "green" : "dark"}>
          {{ LOCKED: "Zamknięte", LOBBY: "Lobby", LIVE: "Na żywo", DONE: "Koniec" }[snap.phase]}
        </Tag>
        <span className={myTurn ? "font-bold text-vg-gold" : ""}>{banner}</span>
        <span className="ml-auto text-[11px] text-vg-muted">
          {snap.steps.filter((s) => s.action !== "DECIDER").length}/{moves}
        </span>
      </div>
      {snap.phase === "LIVE" && secondsLeft !== null && <Progress value={secondsLeft} max={snap.turnSeconds} blocks={45} />}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {ACTIVE_DUTY.map((map) => {
          const tile = tileState(map.id);
          return (
            <MapTile
              key={map.id}
              map={map}
              {...tile}
              selectable={myTurn && tile.state === "open" && !pending}
              selected={choice === map.id}
              onSelect={() => setSelected(map.id)}
            />
          );
        })}
      </div>

      {myTurn && (
        <div className="vg-panel sticky bottom-2 z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <span>{choice ? <>Zaznaczono: <b className="text-vg-gold">{mapById(choice)?.name}</b></> : "Kliknij mapę, aby ją zaznaczyć."}</span>
          <button type="button" data-sfx="mute" data-tone="gold" disabled={!choice || pending} onClick={confirm} className="vg-btn min-h-8 min-w-40">
            {pending ? "Wysyłanie..." : `Potwierdź ${snap.turn?.action === "BAN" ? "ban" : "pick"}`}
          </button>
        </div>
      )}

      {error && (
        <p key={error.at} role="alert" className="vg-deep animate-shake px-3 py-2 text-[#ff9f8a]">
          {error.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_17rem]">
        <Group legend="Przebieg veto">
          <table className="vg-deep w-full text-[12px]">
            <tbody>
              {[...VETO_ORDER[snap.format], { side: null, action: "DECIDER" as const }].map((slot, order) => {
                const step = snap.steps.find((s) => s.order === order);
                const current = snap.turn?.order === order;
                return (
                  <tr key={order} className={`border-b border-vg-ink/70 last:border-b-0 ${current ? "bg-vg-select text-white" : step ? "" : "text-vg-faint"}`}>
                    <td className="w-7 px-2 py-1 tabular">{order + 1}.</td>
                    <td className="w-16 px-1 py-1 font-bold">{slot.action}</td>
                    <td className="truncate px-1 py-1">{slot.side ? teamName(snap, slot.side) : "—"}</td>
                    <td className={`px-2 py-1 text-right ${step?.action === "BAN" && !current ? "text-[#ff9f8a]" : ""}`}>
                      {step ? mapById(step.map)?.name : current ? "wybiera..." : ""}
                      {step?.auto && " (auto)"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Group>

        <Group legend="Mapy meczu">
          {finalMaps.length === 0 ? (
            <p className="text-[12px] text-vg-muted">{snap.format === "BO1" ? "Zostanie jedna mapa – decider." : "Pick A, pick B i decider."}</p>
          ) : (
            <ol className="space-y-1.5">
              {finalMaps.map((step, i) => (
                <li key={step.order} className="vg-deep flex items-center gap-3 px-2 py-1.5">
                  <span className="w-5 font-bold text-vg-gold">{snap.format === "BO1" ? "★" : `${i + 1}.`}</span>
                  <span className="flex-1 font-bold">{mapById(step.map)?.name}</span>
                  <span className="text-[11px] text-vg-muted">{step.action === "DECIDER" ? "decider" : `pick: ${teamName(snap, step.side)}`}</span>
                </li>
              ))}
            </ol>
          )}
        </Group>

        <CaptainDock snap={snap} onChange={refresh} />
      </div>
    </div>
  );
}
