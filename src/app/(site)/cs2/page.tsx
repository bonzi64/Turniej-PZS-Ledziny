import { ModuleView } from "@/components/module/ModuleView";
import { TAGLINE } from "@/content/event";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Counter-Strike 2",
  description: `${TAGLINE} – Counter-Strike 2: regulamin, zapisy drużyn, drabinka i veto map na żywo.`,
  path: "/cs2",
});

export default function Page() {
  return <ModuleView slug="cs2" />;
}
