import Link from "next/link";
import { RULES } from "@/content/rules";

export function RulesText() {
  return (
    <article className="leading-relaxed">
      <p className="mb-4 text-[12px] text-ui-muted">Regulamin Turnieju E-sportowego PZS Lędziny 2026. Obowiązuje wszystkich uczestników.</p>
      {RULES.map((chapter, index) => (
        <section key={chapter.id} className="mb-6">
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
          {chapter.attachment && (
            <a href={chapter.attachment.href} download className="ui-btn mt-3 ml-[1.8rem] inline-flex" data-tone="gold">
              {chapter.attachment.label}
            </a>
          )}
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
