import { ModuleView } from "@/components/module/ModuleView";
import { EVENT, TAGLINE } from "@/content/event";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "League of Legends",
  description: `${TAGLINE} – szkolny turniej League of Legends ${EVENT.dateLabel}: regulamin, zapisy drużyn, lista zespołów i drabinka na żywo.`,
  path: "/",
});

export default function HomePage() {
  return <ModuleView />;
}
