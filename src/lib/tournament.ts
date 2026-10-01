export const MAX_TEAMS = 8;
export const MAIN_ROSTER = 5;
export const RESERVE_SLOT = MAIN_ROSTER;

export const ROUNDS = [
  { round: 1, label: "Ćwierćfinały", short: "QF", matches: 4 },
  { round: 2, label: "Półfinały", short: "SF", matches: 2 },
  { round: 3, label: "Finał", short: "F", matches: 1 },
] as const;

export const FINAL_ROUND = ROUNDS.length;

export const roundLabel = (round: number) => ROUNDS.find((r) => r.round === round)?.label ?? `Runda ${round}`;

export function matchLabel(round: number, slot: number) {
  const meta = ROUNDS.find((r) => r.round === round);
  if (!meta) return `R${round}·${slot + 1}`;
  return meta.matches === 1 ? meta.label : `${meta.label.slice(0, -1)} ${slot + 1}`;
}

// po normalizacji: wielkie litery, bez spacji – "2TI", "3A", "1TP2"
export const CLASS_PATTERN = /^[1-5][A-ZĄĆĘŁŃÓŚŹŻ]{1,4}\d?$/;
