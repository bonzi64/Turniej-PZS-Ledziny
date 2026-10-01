import { Backdrop } from "@/components/shell/Backdrop";
import { BootSplash } from "@/components/shell/BootSplash";
import { LegalNote } from "@/components/shell/LegalNote";
import { SideMenu } from "@/components/shell/SideMenu";
import { GAMES } from "@/lib/games";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const games = GAMES.map(({ slug, name, short, vetoEnabled }) => ({ slug, name, short, vetoEnabled }));

  return (
    <div data-skin="vgui">
      <BootSplash host="pzs-ledziny.lan:27015" />
      <Backdrop />
      <SideMenu games={games} />

      <div className="relative min-h-dvh pt-14 lg:pt-14 lg:pl-[19rem] xl:pl-[20rem]">
        <main className="mx-auto w-full max-w-[1100px] px-2 pb-6 sm:px-4 lg:pr-6">{children}</main>
        <footer className="mx-auto max-w-[1100px] px-3 pb-6 sm:px-4 lg:pr-6">
          <LegalNote />
        </footer>
      </div>
    </div>
  );
}
