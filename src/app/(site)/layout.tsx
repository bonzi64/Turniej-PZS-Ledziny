import { Backdrop } from "@/components/shell/Backdrop";
import { Intro } from "@/components/shell/Intro";
import { LegalNote } from "@/components/shell/LegalNote";
import { SocialPanel } from "@/components/shell/SocialPanel";
import { TopBar } from "@/components/shell/TopBar";
import { GAME } from "@/lib/games";
import { getPublicTeams, getSlotStats, type PublicTeam, type SlotStat } from "@/lib/queries";
import { registrationWindow } from "@/lib/registration";

// panel drużyn jest dodatkiem – gdy baza nie odpowie, strona i tak się wyświetli, a błąd pokaże sama treść
async function socialData(): Promise<{ teams: PublicTeam[]; stats: SlotStat[] }> {
  try {
    const [stats, teams] = await Promise.all([getSlotStats(), getPublicTeams(GAME.code)]);
    return { stats, teams };
  } catch {
    return { stats: [], teams: [] };
  }
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { teams, stats } = await socialData();

  return (
    <>
      <Intro />
      <Backdrop />
      <TopBar />

      <div className="flex">
        <div className="min-w-0 flex-1">
          <main id="okno" className="mx-auto w-full max-w-[1180px] scroll-mt-24 px-3 pt-5 pb-10 sm:px-6 lg:pt-8">
            {children}
          </main>
          <footer className="mx-auto max-w-[1180px] px-3 pb-8 sm:px-6">
            <LegalNote />
          </footer>
        </div>
        <SocialPanel teams={teams} initial={stats} signupOpen={registrationWindow().open} />
      </div>
    </>
  );
}
