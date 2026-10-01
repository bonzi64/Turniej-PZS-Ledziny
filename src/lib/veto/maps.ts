export type CsMap = {
  id: string;
  name: string;
  code: string;
  tone: string;
  callouts: string[];
};

export const MAP_POOL_STAMP = "Active Duty · stan na lipiec 2026";

export const ACTIVE_DUTY: readonly CsMap[] = [
  { id: "ancient", name: "Ancient", code: "de_ancient", tone: "#4f9d69", callouts: ["DONUT", "CAVE", "RED", "TEMPLE"] },
  { id: "anubis", name: "Anubis", code: "de_anubis", tone: "#d8a94a", callouts: ["CANAL", "BRIDGE", "PALACE", "STREET"] },
  { id: "cache", name: "Cache", code: "de_cache", tone: "#8fa3b8", callouts: ["SQUEAKY", "Z-CONN", "CHECKERS", "HIGHWAY"] },
  { id: "dust2", name: "Dust II", code: "de_dust2", tone: "#e0873a", callouts: ["LONG", "CATWALK", "TUNELE", "XBOX"] },
  { id: "inferno", name: "Inferno", code: "de_inferno", tone: "#d2553a", callouts: ["BANANA", "APPS", "PIT", "LIBRARY"] },
  { id: "mirage", name: "Mirage", code: "de_mirage", tone: "#5fb4d9", callouts: ["PALACE", "RAMP", "WINDOW", "JUNGLE"] },
  { id: "nuke", name: "Nuke", code: "de_nuke", tone: "#3cc8a8", callouts: ["OUTSIDE", "RAMP", "HUT", "VENTS"] },
];

export const mapById = (id: string) => ACTIVE_DUTY.find((m) => m.id === id);
