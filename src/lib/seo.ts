import type { Metadata } from "next";
import { EVENT, TAGLINE } from "@/content/event";

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} // ${TAGLINE}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: `PZS E-SPORTS ${EVENT.edition}`,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
