import { Group, Tag, Window } from "@/components/vgui/Window";
import { EVENT } from "@/content/event";
import { COMMON_RULES } from "@/content/rules";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Klauzula informacyjna RODO",
  description: `Jak ${EVENT.school} przetwarza dane uczestników turnieju e-sportowego ${EVENT.edition}.`,
  path: "/rodo",
});

const DATA_MAP = [
  { field: "Nazwa i tag drużyny", public: true, why: "Lista drużyn, drabinka" },
  { field: "Nick w grze", public: true, why: "Identyfikacja w meczu" },
  { field: "Klasa", public: true, why: "Potwierdzenie, że zawodnik jest uczniem PZS" },
  { field: "Imię i nazwisko", public: false, why: "Weryfikacja z listą uczniów" },
  { field: "E-mail kapitana", public: false, why: "Kontakt w sprawie zgłoszenia i meczów" },
  { field: "Discord kapitana", public: false, why: "Szybki kontakt w dniu turnieju (opcjonalnie)" },
];

export default function PrivacyPage() {
  const rodo = COMMON_RULES.find((c) => c.id === "rodo");

  return (
    <Window title="Klauzula informacyjna RODO" closeHref="/" status={<span>Art. 13 RODO · {EVENT.school}</span>}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-5">
          <ol className="vg-deep">
            {rodo?.points.map((point, i) => (
              <li key={point} className="grid grid-cols-[2rem_1fr] border-b border-vg-ink/70 px-3 py-2 last:border-b-0">
                <span className="font-bold text-vg-gold tabular">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>

          <Group legend="Mapa danych">
            <div className="vg-deep vg-scroll overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse text-left text-[12px]">
                <thead>
                  <tr className="bg-vg-panel text-vg-muted">
                    <th className="px-2 py-1 font-normal">Dane</th>
                    <th className="px-2 py-1 font-normal">Widoczność</th>
                    <th className="px-2 py-1 font-normal">Cel</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_MAP.map((row) => (
                    <tr key={row.field} className="vg-row border-b border-vg-ink/70 last:border-b-0">
                      <td className="px-2 py-1.5">{row.field}</td>
                      <td className="px-2 py-1.5">{row.public ? <Tag tone="green">Publiczne</Tag> : <Tag tone="orange">Tylko organizator</Tag>}</td>
                      <td className="px-2 py-1.5 text-vg-muted">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Group>
        </div>

        <div className="space-y-5">
          <Group legend="Administrator">
            <p>{EVENT.school}</p>
            <p className="text-vg-muted">{EVENT.address}</p>
          </Group>
          <Group legend="Inspektor Ochrony Danych">
            <p className="text-vg-muted">{EVENT.dpoContact}</p>
          </Group>
          <Group legend="Organizatorzy">
            <p className="text-vg-muted">{EVENT.organizers}</p>
            <p className="text-vg-muted">{EVENT.contactEmail}</p>
          </Group>
          <p className="text-[11px] text-vg-faint">
            Po {EVENT.dataRetention} organizator anonimizuje imiona, nazwiska i dane kontaktowe jednym poleceniem w panelu.
          </p>
        </div>
      </div>
    </Window>
  );
}
