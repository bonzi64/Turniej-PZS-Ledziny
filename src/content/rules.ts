import { EVENT } from "@/content/event";

export type RuleChapter = {
  id: string;
  title: string;
  points: string[];
  attachment?: { href: string; label: string };
};

export const RULES: RuleChapter[] = [
  {
    id: "ogolne",
    title: "Postanowienia ogólne",
    points: [
      "Turniej Counter-Strike 2 (CS2) organizowany jest dla uczniów Powiatowego Zespołu Szkół w Lędzinach.",
      "Celem turnieju jest rozwijanie umiejętności współpracy zespołowej, promowanie zdrowej rywalizacji oraz integracja społeczności szkolnej.",
      "Udział w turnieju jest dobrowolny.",
      "Każdy uczestnik zobowiązany jest do zapoznania się z niniejszym regulaminem i jego przestrzegania.",
      "Organizatorzy zastrzegają sobie prawo do podejmowania decyzji w sprawach nieuregulowanych niniejszym regulaminem.",
    ],
  },
  {
    id: "wiek",
    title: "Ograniczenia wiekowe i zgoda rodziców",
    points: [
      "W turnieju mogą uczestniczyć wyłącznie uczniowie PZS Lędziny, którzy ukończyli 17 lat.",
      "Uczestnicy w wieku 17 lat muszą przedstawić pisemną zgodę rodzica lub opiekuna prawnego na udział w turnieju.",
      "Każdy uczestnik, który nie ukończył 18 lat, musi przynieść wydrukowaną i podpisaną zgodę rodzica lub opiekuna prawnego i oddać ją organizatorowi najpóźniej w dniu turnieju, przed pierwszym meczem. Wzór zgody można pobrać poniżej oraz w formularzu zapisów.",
      "Uczestnicy, którzy ukończyli 18 lat, mogą brać udział w turnieju bez zgody rodzica lub opiekuna prawnego.",
      "Osoby poniżej 17. roku życia nie mogą uczestniczyć w turnieju.",
      "Brak wymaganej zgody rodzica lub opiekuna prawnego skutkuje niedopuszczeniem niepełnoletniego uczestnika do rozgrywek.",
      "Organizatorzy mają prawo zweryfikować wiek uczestników na podstawie dokumentacji szkolnej.",
      "Zgłaszając drużynę, kapitan oświadcza w formularzu, że wszyscy zgłoszeni zawodnicy ukończyli 17 lat.",
    ],
    attachment: { href: EVENT.consentForm, label: "Pobierz wzór zgody rodzica (PDF)" },
  },
  {
    id: "zgloszenia",
    title: "Zasady zgłoszeń",
    points: [
      "Zgłoszenia odbywają się w terminie wyznaczonym przez organizatorów.",
      "Każda drużyna składa się z 5 zawodników.",
      "Każdy uczestnik może reprezentować wyłącznie jedną drużynę.",
      "Drużyna zobowiązana jest do wyznaczenia kapitana odpowiedzialnego za kontakt z organizatorami.",
      "Nazwy drużyn nie mogą zawierać treści obraźliwych, dyskryminujących ani wulgarnych.",
      "Organizatorzy mogą odmówić przyjęcia zgłoszenia niespełniającego wymagań regulaminu.",
    ],
  },
  {
    id: "rozgrywki",
    title: "System rozgrywek",
    points: [
      "Turniej rozgrywany jest w grze Counter-Strike 2 w trybie 5 na 5.",
      "Mecze odbywają się na zasadach standardowego trybu turniejowego (MR12).",
      "System rozgrywek (grupowy, pucharowy lub mieszany) zostanie ustalony po zakończeniu zapisów, w zależności od liczby zgłoszonych drużyn.",
      "Mecze mogą być rozgrywane w formacie BO1, BO3 lub BO5, zgodnie z harmonogramem ustalonym przez organizatorów.",
      "W przypadku remisu obowiązuje dogrywka zgodnie z ustawieniami serwera.",
      "Wybór map odbywa się poprzez system banowania i wybierania map (veto).",
      "Każda drużyna zobowiązana jest do punktualnego stawienia się na wyznaczony mecz.",
    ],
  },
  {
    id: "fair-play",
    title: "Zasady uczciwej rywalizacji",
    points: [
      "Zabronione jest korzystanie z jakiegokolwiek oprogramowania zapewniającego nieuczciwą przewagę, w szczególności cheatów, wallhacków, aimbotów oraz innych niedozwolonych modyfikacji.",
      "Zabrania się wykorzystywania błędów gry w sposób sprzeczny z zasadami uczciwej rywalizacji.",
      "Niedozwolone jest celowe zakłócanie przebiegu meczu, sabotowanie rozgrywki oraz ustawianie wyników.",
      "Uczestnicy zobowiązani są do zachowania kultury osobistej wobec przeciwników, członków własnej drużyny, sędziów i organizatorów.",
      "Zabrania się stosowania gróźb, wyzwisk, dyskryminacji oraz innych form nękania.",
      "Naruszenie zasad może skutkować ostrzeżeniem, przegraną walkowerem lub dyskwalifikacją z turnieju.",
    ],
  },
  {
    id: "technika",
    title: "Problemy techniczne i przerwy",
    points: [
      "W przypadku problemów technicznych uczestnik powinien niezwłocznie poinformować organizatora lub sędziego.",
      "Decyzję o wstrzymaniu, wznowieniu lub powtórzeniu meczu podejmuje organizator.",
      "Celowe opuszczanie meczu bez uzasadnionej przyczyny jest zabronione.",
      "W przypadku niestawienia się drużyny w ciągu 10 minut od wyznaczonego terminu organizator może przyznać walkower przeciwnikom.",
      "Organizatorzy nie odpowiadają za indywidualne problemy sprzętowe lub internetowe uczestników, jednak mogą uwzględnić szczególne okoliczności.",
    ],
  },
  {
    id: "zachowanie",
    title: "Zachowanie uczestników",
    points: [
      "Każdy zawodnik zobowiązany jest do przestrzegania zasad fair play.",
      "Zabronione jest obrażanie innych uczestników, prowokowanie konfliktów oraz celowe utrudnianie przebiegu turnieju.",
      "Decyzje sędziów i organizatorów dotyczące przebiegu rozgrywek są wiążące.",
      "Uczestnicy zobowiązani są również do przestrzegania obowiązujących zasad i regulaminów szkolnych.",
    ],
  },
  {
    id: "nagrody",
    title: "Nagrody",
    points: [
      "Informacje o ewentualnych nagrodach zostaną przekazane uczestnikom przed rozpoczęciem turnieju.",
      "Nagrody przyznawane są zgodnie z klasyfikacją końcową.",
      "W przypadku dyskwalifikacji drużyna traci prawo do otrzymania nagrody, chyba że organizator postanowi inaczej.",
    ],
  },
  {
    id: "koncowe",
    title: "Postanowienia końcowe",
    points: [
      "Zgłoszenie do turnieju oznacza zapoznanie się z regulaminem i zobowiązanie do jego przestrzegania.",
      "Organizatorzy zastrzegają sobie prawo do zmiany harmonogramu w uzasadnionych przypadkach.",
      "Wszelkie spory rozstrzygane są przez organizatorów turnieju.",
      "Organizatorzy mogą wprowadzić zmiany w regulaminie, informując o nich uczestników przed ich wejściem w życie.",
      "Turniej odbywa się za zgodą dyrekcji szkoły, jeżeli jest organizowany jako oficjalne wydarzenie szkolne.",
    ],
  },
];

// klauzula informacyjna na stronie /rodo – poza numeracją regulaminu
export const PRIVACY_POINTS: string[] = [
  `Administratorem danych osobowych jest ${EVENT.school}, ${EVENT.address}.`,
  "Dane (imię, nazwisko, klasa, nick, e-mail i Discord kapitana) przetwarzamy wyłącznie w celu organizacji turnieju i weryfikacji uczestników – na podstawie zgody (art. 6 ust. 1 lit. a RODO).",
  "Publicznie na stronie pokazujemy tylko: nazwę drużyny, nicki zawodników i klasę. Imiona, nazwiska i dane kontaktowe widzą wyłącznie organizatorzy w zabezpieczonym panelu.",
  `Dane przechowujemy do ${EVENT.dataRetention}, a następnie je usuwamy. Wyniki (nazwa drużyny, nicki, klasa) mogą pozostać w archiwum turnieju.`,
  "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz cofnięcia zgody w dowolnym momencie (bez wpływu na wcześniejsze przetwarzanie), a także prawo skargi do Prezesa UODO.",
  "Zawodnicy, którzy nie ukończyli 18 lat, oddają organizatorowi papierową zgodę rodzica lub opiekuna prawnego z jego imieniem i nazwiskiem. Zgody widzą wyłącznie organizatorzy i przechowujemy je do tego samego terminu co pozostałe dane.",
  "Publikacja wizerunku (zdjęcia, transmisja) wymaga odrębnej zgody zbieranej przez szkołę.",
  `Kontakt w sprawie danych: ${EVENT.dpoContact}.`,
];
