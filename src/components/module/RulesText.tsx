import Link from "next/link";
import { RULES } from "@/content/rules";

export function RulesText() {
  return (
    <article className="max-w-[68ch] text-[15px] leading-relaxed text-parchment/90">
      <p className="mb-6 text-[14px] text-ui-muted">Regulamin Turnieju E-sportowego PZS Lędziny 2026. Obowiązuje wszystkich uczestników.</p>
      {RULES.map((chapter, index) => (
        <section key={chapter.id} className="mb-8">
          <h3 className="ui-rule-head mb-3">
            <span>§{index + 1}.</span> {chapter.title}
          </h3>
          <ol className="space-y-2">
            {chapter.points.map((point, i) => (
              <li key={point} className="grid grid-cols-[1.8rem_1fr]">
                <span className="text-gold tabular">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
      <p className="border-t border-umber pt-4 text-[14px] text-ui-muted">
        Koniec regulaminu. Pełna klauzula informacyjna:{" "}
        <Link href="/rodo" className="text-ui-accent underline">
          dane osobowe
        </Link>
      </p>
    </article>
  );
}
