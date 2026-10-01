import Link from "next/link";
import { COMMON_RULES, GAME_RULES } from "@/content/rules";
import type { GameSlug } from "@/lib/games";

export function RulesText({ slug }: { slug: GameSlug }) {
  const chapters = [...COMMON_RULES.slice(0, 4), GAME_RULES[slug], COMMON_RULES[4]];

  return (
    <article className="leading-relaxed">
      <p className="mb-4 text-[12px] text-ui-muted">Regulamin Turnieju E-sportowego PZS Lędziny 2026. Obowiązuje wszystkich uczestników.</p>
      {chapters.map((chapter, index) => (
        <section key={`${chapter.id}-${index}`} className="mb-6">
          <h3 className="ui-rule-head mb-2.5">
            <span>§{index + 1}.</span> {chapter.title}
          </h3>
          <ol className="space-y-1.5">
            {chapter.points.map((point, i) => (
              <li key={point} className="grid grid-cols-[1.8rem_1fr]">
                <span className="text-ui-faint tabular">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="border-t border-ui-line pt-3 text-[12px] text-ui-muted">
        Koniec regulaminu. Pełna klauzula informacyjna:{" "}
        <Link href="/rodo" className="text-ui-accent underline">
          dane osobowe
        </Link>
      </p>
    </article>
  );
}
