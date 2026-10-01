import type { MatchFormat, Side, VetoAction } from "@/generated/prisma/enums";

export type VetoTurn = { side: Side; action: Exclude<VetoAction, "DECIDER"> };

// ostatnia mapa po sekwencji zawsze wpada jako DECIDER
export const VETO_ORDER: Record<MatchFormat, readonly VetoTurn[]> = {
  BO1: [
    { side: "A", action: "BAN" },
    { side: "B", action: "BAN" },
    { side: "A", action: "BAN" },
    { side: "B", action: "BAN" },
    { side: "A", action: "BAN" },
    { side: "B", action: "BAN" },
  ],
  BO3: [
    { side: "A", action: "BAN" },
    { side: "B", action: "BAN" },
    { side: "A", action: "PICK" },
    { side: "B", action: "PICK" },
    { side: "A", action: "BAN" },
    { side: "B", action: "BAN" },
  ],
};

export const turnAt = (format: MatchFormat, done: number): VetoTurn | null => VETO_ORDER[format][done] ?? null;

export const opposite = (side: Side): Side => (side === "A" ? "B" : "A");

export type VetoPhase = "LOCKED" | "LOBBY" | "LIVE" | "DONE";
