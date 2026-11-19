import { Group, PageHead, Tag } from "@/components/hx/frame";
import { EVENT } from "@/content/event";
import { PRIVACY_POINTS } from "@/content/rules";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Klauzula informacyjna RODO",
  description: `Jak ${EVENT.school} przetwarza dane uczestników turnieju e-sportowego ${EVENT.edition}.`,
  path: "/rodo",
});

const DATA_MAP = [
  { field: "Nazwa i tag drużyny", public: true, why: "Lista drużyn, drabinka" },
  { field: "Riot ID (nick w grze)", public: true, why: "Identyfikacja w meczu" },
  { field: "Klasa", public: true, why: "Potwierdzenie, że zawodnik jest uczniem PZS" },
  { field: "Imię i nazwisko", public: false, why: "Weryfikacja z listą uczniów" },
  { field: "E-mail kapitana", public: false, why: "Kontakt w sprawie zgłoszenia i meczów" },
  { field: "Discord kapitana", public: false, why: "Szybki kontakt w dniu turnieju (opcjonalnie)" },
  { field: "Zdjęcia z turnieju (wizerunek)", public: true, why: "Galeria po turnieju – tylko za zgodą na publikację wizerunku" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHead title="Dane osobowe">
        Klauzula informacyjna (art. 13 RODO) dla uczestników Turnieju E-sportowego PZS Lędziny {EVENT.edition}.
      </PageHead>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <ol className="hx-frame divide-y divide-hull">
            {PRIVACY_POINTS.map((point, i) => (
              <li key={point} className="grid grid-cols-[2.25rem_1fr] px-5 py-3.5 text-[15px] leading-relaxed">
                <span className="font-display text-gold tabular">{i + 1}.</span>
                <span className="max-w-[68ch] text-parchment/90">{point}</span>
              </li>
            ))}
          </ol>

          <section aria-labelledby="map-title" className="hx-frame">
            <h2 id="map-title" className="hx-head px-5 pt-4">
              Mapa danych
            </h2>
            <div className="hx-divider mx-5 mt-2.5 mb-4" data-align="start" aria-hidden />
            <div className="ui-scroll overflow-x-auto px-5 pb-5">
              <table className="w-full min-w-[32rem] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="ui-subhead">
                    <th className="px-3 py-2 font-bold">Dane</th>
                    <th className="px-3 py-2 font-bold">Widoczność</th>
                    <th className="px-3 py-2 font-bold">Cel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hull">
                  {DATA_MAP.map((row) => (
                    <tr key={row.field} className="ui-row">
                      <td className="px-3 py-2.5 text-parchment">{row.field}</td>
                      <td className="px-3 py-2.5">{row.public ? <Tag tone="green">Publiczne</Tag> : <Tag tone="orange">Tylko organizator</Tag>}</td>
                      <td className="px-3 py-2.5 text-ui-muted">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <Group legend="Administrator">
            <p className="text-parchment">{EVENT.school}</p>
            <p className="text-ui-muted">{EVENT.address}</p>
          </Group>
          <Group legend="Inspektor Ochrony Danych">
            <p className="text-ui-muted">{EVENT.dpoContact}</p>
          </Group>
          <Group legend="Organizatorzy">
            <ul className="text-parchment">
              {EVENT.organizers.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <a href={`mailto:${EVENT.contactEmail}`} className="mt-2 inline-block text-gold underline hover:text-parchment">
              {EVENT.contactEmail}
            </a>
          </Group>
          <p className="px-1 text-[13px] text-ui-faint">Po {EVENT.dataRetention} organizator anonimizuje imiona, nazwiska i dane kontaktowe jednym poleceniem w panelu.</p>
        </div>
      </div>
    </>
  );
}
