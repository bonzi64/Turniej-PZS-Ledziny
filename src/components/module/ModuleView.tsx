import { BracketView } from "@/components/module/BracketView";
import { HomeTab } from "@/components/module/HomeTab";
import { RegistrationForm } from "@/components/module/RegistrationForm";
import { RulesGate, RulesProvider } from "@/components/module/RulesGate";
import { RulesText } from "@/components/module/RulesText";
import { TabPanels } from "@/components/module/TabPanels";
import { TeamBoard } from "@/components/module/TeamBoard";
import { PageHead } from "@/components/hx/frame";
import { EVENT } from "@/content/event";
import { env } from "@/lib/env";
import { GAME } from "@/lib/games";
import { getPublicBracket, getPublicTeams, getSlotStats } from "@/lib/queries";
import { issueRulesTicket, registrationWindow } from "@/lib/registration";
import { MAX_TEAMS } from "@/lib/tournament";

export async function ModuleView() {
  const game = GAME;
  const [stats, teams, bracket] = await Promise.all([getSlotStats(), getPublicTeams(game.code), getPublicBracket(game.code)]);
  const stat = stats.find((s) => s.slug === game.slug);
  const signup = registrationWindow();
  const full = (stat?.taken ?? 0) >= MAX_TEAMS;
  const closedReason = !signup.open ? signup.reason : full ? "Komplet – wszystkie 8 miejsc jest zajętych." : null;
  const played = bracket.flat().filter((m) => m.winner).length;

  const tabs = [
    {
      id: "info",
      label: "Start",
      content: <HomeTab stats={stats} bracket={bracket} closedReason={closedReason} />,
    },
    {
      id: "regulamin",
      label: "Regulamin",
      content: (
        <>
          <PageHead title="Regulamin">Formularz zapisów odblokuje się, gdy przewiniesz regulamin do końca i minie minimalny czas lektury.</PageHead>
          <RulesGate>
            <RulesText />
          </RulesGate>
        </>
      ),
    },
    {
      id: "zapisy",
      label: "Zapisz drużynę",
      content: (
        <>
          <PageHead title="Zapisz drużynę">
            Pięciu graczy i opcjonalnie rezerwowy. Zapisy do {EVENT.registrationClosesLabel}, decyduje kolejność zatwierdzonych zgłoszeń.
          </PageHead>
          <RegistrationForm slug={game.slug} gameName={game.name} nickLabel={game.nickLabel} nickPlaceholder={game.nickPlaceholder} closedReason={closedReason} />
        </>
      ),
    },
    {
      id: "druzyny",
      label: "Drużyny",
      content: (
        <>
          <PageHead title={`Drużyny ${teams.length}/${MAX_TEAMS}`}>Zatwierdzone składy. Publicznie pokazujemy tylko nicki, nazwę drużyny i klasę.</PageHead>
          <TeamBoard teams={teams} pending={stat?.pending ?? 0} max={MAX_TEAMS} />
        </>
      ),
    },
    {
      id: "drabinka",
      label: "Drabinka",
      content: (
        <>
          <PageHead title="Drabinka" aside={<p className="text-[14px] text-ui-muted tabular">Rozegrane mecze: {played}/7</p>}>
            Pojedyncza eliminacja, wszystkie mecze BO1. Zwycięzca automatycznie przechodzi do kolejnej rundy.
          </PageHead>
          <BracketView rounds={bracket} />
        </>
      ),
    },
  ];

  return (
    <RulesProvider slug={game.slug} ticket={issueRulesTicket(game.slug)} minSeconds={env.rulesMinSeconds}>
      <TabPanels tabs={tabs} fallback="info" />
    </RulesProvider>
  );
}
