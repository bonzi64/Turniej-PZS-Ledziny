import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VetoRoom } from "@/components/veto/VetoRoom";
import { Window } from "@/components/vgui/Window";
import { buildSnapshot } from "@/lib/veto/service";

export async function generateMetadata(props: PageProps<"/cs2/veto/[matchId]">): Promise<Metadata> {
  const { matchId } = await props.params;
  const snap = await buildSnapshot(matchId);
  if (!snap) return { title: "Veto map" };
  const versus = `${snap.teams.A?.name ?? "TBD"} vs ${snap.teams.B?.name ?? "TBD"}`;
  return {
    title: `Veto · ${versus}`,
    description: `Map veto na żywo: ${snap.label}, ${snap.format}. CS2 – Turniej PZS Lędziny 2026.`,
    robots: { index: false },
  };
}

export default async function VetoPage(props: PageProps<"/cs2/veto/[matchId]">) {
  const { matchId } = await props.params;
  const snapshot = await buildSnapshot(matchId);
  if (!snapshot) notFound();

  return (
    <Window title={`Map veto — ${snapshot.label} · ${snapshot.format}`} closeHref="/cs2#veto">
      <VetoRoom initial={snapshot} />
    </Window>
  );
}
