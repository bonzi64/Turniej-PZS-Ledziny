import { notFound } from "next/navigation";
import { BracketView } from "@/components/module/BracketView";
import { ModuleOverview } from "@/components/module/ModuleOverview";
import { RegistrationForm } from "@/components/module/RegistrationForm";
import { RulesGate, RulesProvider } from "@/components/module/RulesGate";
import { RulesText } from "@/components/module/RulesText";
import { TeamBoard } from "@/components/module/TeamBoard";
import { VetoLobbyList } from "@/components/module/VetoLobbyList";
import { TabbedWindow } from "@/components/vgui/TabbedWindow";
import { EVENT } from "@/content/event";
import { env } from "@/lib/env";
import { gameBySlug, type GameSlug } from "@/lib/games";
import { getPublicBracket, getPublicTeams, getSlotStats } from "@/lib/queries";
import { issueRulesTicket, registrationWindow } from "@/lib/registration";
import { MAX_TEAMS } from "@/lib/tournament";

export async function ModuleView({ slug }: { slug: GameSlug }) {
  const game = gameBySlug(slug);
  if (!game) notFound();

  const [stats, teams, bracket] = await Promise.all([getSlotStats(), getPublicTeams(game.code), getPublicBracket(game.code)]);
  const stat = stats.find((s) => s.slug === slug);
  const signup = registrationWindow();
  const full = (stat?.taken ?? 0) >= MAX_TEAMS;
  const closedReason = !signup.open ? signup.reason : full ? "Komplet – wszystkie 8 slotów jest zajętych." : null;
  const played = bracket.flat().filter((m) => m.winner).length;

  const tabs = [
    { id: "info", label: "Informacje", content: <ModuleOverview game={game} stats={stats} open={signup.open} closedReason={closedReason} /> },
    {
      id: "regulamin",
      label: "Regulamin",
      content: (
        <RulesGate>
          <RulesText slug={slug} />
        </RulesGate>
      ),
    },
    {
      id: "zapisy",
      label: "Zapisy",
      content: (
        <RegistrationForm
          slug={slug}
          gameName={game.name}
          nickLabel={game.nickLabel}
          nickPlaceholder={game.nickPlaceholder}
          closedReason={closedReason}
        />
      ),
    },
    { id: "druzyny", label: `Drużyny (${teams.length})`, content: <TeamBoard teams={teams} pending={stat?.pending ?? 0} max={MAX_TEAMS} /> },
    { id: "drabinka", label: "Drabinka", content: <BracketView rounds={bracket} withVeto={game.vetoEnabled} /> },
    ...(game.vetoEnabled ? [{ id: "veto", label: "Map veto", content: <VetoLobbyList rounds={bracket} /> }] : []),
  ];

  return (
    <div id="okno" className="scroll-mt-16">
      <RulesProvider slug={slug} ticket={issueRulesTicket(slug)} minSeconds={env.rulesMinSeconds}>
        <TabbedWindow
          title={`${game.name} — ${EVENT.title} ${EVENT.edition}`}
          tabs={tabs}
          fallback="info"
          status={
            <>
              <span>
                Drużyny: {stat?.taken ?? 0}/{MAX_TEAMS} · mecze rozegrane: {played}/7
              </span>
              <span>{signup.open ? `Zapisy do ${EVENT.registrationClosesLabel}` : "Zapisy zamknięte"}</span>
            </>
          }
        />
      </RulesProvider>
    </div>
  );
}
