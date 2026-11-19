import { EVENT } from "@/content/event";
import { MAX_TEAMS } from "@/lib/tournament";

export type RuleChapter = {
  id: string;
  title: string;
  points: string[];
};

export const RULES: RuleChapter[] = [
  {
    id: "ogolne",
    title: "Postanowienia ogólne",
    points: [
      "Turniej League of Legends (LoL) organizowany jest dla uczniów Powiatowego Zespołu Szkół w Lędzinach.",
      `Turniej odbywa się ${EVENT.dateLabel} (${EVENT.weekday}) w szkolnej pracowni komputerowej, ${EVENT.address}. Zbiórka o ${EVENT.checkIn}, pierwszy mecz o ${EVENT.kickoff}.`,
      "Celem turnieju jest rozwijanie umiejętności współpracy zespołowej, promowanie zdrowej rywalizacji oraz integracja społeczności szkolnej.",
      "W turnieju mogą uczestniczyć wyłącznie uczniowie PZS Lędziny. Udział w turnieju jest dobrowolny i bezpłatny.",
      "Każdy uczestnik zobowiązany jest do zapoznania się z niniejszym regulaminem i jego przestrzegania.",
      "Organizatorzy zastrzegają sobie prawo do podejmowania decyzji w sprawach nieuregulowanych niniejszym regulaminem.",
    ],
  },
  {
    id: "zgloszenia",
    title: "Zasady zgłoszeń",
    points: [
      `Zgłoszenia przyjmujemy wyłącznie przez formularz na tej stronie do ${EVENT.registrationClosesLabel}.`,
      "Każda drużyna składa się z 5 zawodników i może zgłosić 1 zawodnika rezerwowego.",
      "Każdy uczestnik może reprezentować wyłącznie jedną drużynę.",
      "Drużyna zobowiązana jest do wyznaczenia kapitana odpowiedzialnego za kontakt z organizatorami.",
      `W turnieju bierze udział maksymalnie ${MAX_TEAMS} drużyn. O miejscu decyduje kolejność zgłoszeń zatwierdzonych przez organizatora.`,
      "Nazwy drużyn i nicki nie mogą zawierać treści obraźliwych, dyskryminujących ani wulgarnych.",
      "Organizatorzy mogą odmówić przyjęcia zgłoszenia niespełniającego wymagań regulaminu.",
    ],
  },
  {
    id: "rozgrywki",
    title: "System rozgrywek",
    points: [
      "Turniej rozgrywany jest w grze League of Legends w trybie 5 na 5 na mapie Summoner's Rift.",
      "Mecze rozgrywane są jako gry niestandardowe w trybie Tournament Draft. Bany i wybory bohaterów odbywają się w kliencie gry.",
      `System pucharowy (pojedyncza eliminacja) dla ${MAX_TEAMS} drużyn: ćwierćfinały, półfinały i finał.`,
      "Wszystkie mecze, także finał, rozgrywane są w formacie BO1, aby turniej zakończył się zgodnie z planem zajęć.",
      "Stronę mapy (niebieską lub czerwoną) wybiera drużyna zapisana w drabince jako pierwsza.",
      "Każdy zawodnik gra na własnym koncie Riot i odpowiada za to, aby konto pozwalało na udział w grze niestandardowej w trybie Tournament Draft.",
      "Ponowne rozpoczęcie gry (remake) jest dozwolone, jeśli zawodnik rozłączył się przed 3. minutą i przed pierwszym zabójstwem w grze.",
      "Każda drużyna zobowiązana jest do punktualnego stawienia się na wyznaczony mecz.",
    ],
  },
  {
    id: "fair-play",
    title: "Zasady uczciwej rywalizacji",
    points: [
      "Zabronione jest korzystanie z jakiegokolwiek oprogramowania zapewniającego nieuczciwą przewagę, w szczególności skryptów, makr, programów automatyzujących grę oraz innych niedozwolonych modyfikacji.",
      "Zabronione jest granie na cudzym koncie oraz udostępnianie swojego konta innym osobom.",
      "Zabrania się wykorzystywania błędów gry w sposób sprzeczny z zasadami uczciwej rywalizacji.",
      "Niedozwolone jest celowe zakłócanie przebiegu meczu, sabotowanie rozgrywki oraz ustawianie wyników.",
      "Uczestnicy zobowiązani są do zachowania kultury osobistej wobec przeciwników, członków własnej drużyny, sędziów i organizatorów, także na czacie gry.",
      "Zabrania się stosowania gróźb, wyzwisk, dyskryminacji oraz innych form nękania.",
      "Naruszenie zasad może skutkować ostrzeżeniem, przegraną walkowerem lub dyskwalifikacją z turnieju.",
    ],
  },
  {
    id: "technika",
    title: "Problemy techniczne i przerwy",
    points: [
      "W przypadku problemów technicznych uczestnik powinien niezwłocznie poinformować organizatora lub sędziego.",
      "Pauzę techniczną zgłasza się sędziemu. Łączny limit pauz technicznych to 10 minut na drużynę w jednym meczu.",
      "Decyzję o wstrzymaniu, wznowieniu lub powtórzeniu meczu podejmuje organizator.",
      "Celowe opuszczanie meczu bez uzasadnionej przyczyny jest zabronione.",
      "W przypadku niestawienia się drużyny w ciągu 10 minut od wyznaczonego terminu organizator może przyznać walkower przeciwnikom.",
      "Organizatorzy nie odpowiadają za indywidualne problemy z kontami uczestników, jednak mogą uwzględnić szczególne okoliczności.",
    ],
  },
  {
    id: "zachowanie",
    title: "Zachowanie uczestników",
    points: [
      "Każdy zawodnik zobowiązany jest do przestrzegania zasad fair play.",
      "Zabronione jest obrażanie innych uczestników, prowokowanie konfliktów oraz celowe utrudnianie przebiegu turnieju.",
      "Decyzje sędziów i organizatorów dotyczące przebiegu rozgrywek są wiążące.",
      "Uczestnicy zobowiązani są również do przestrzegania obowiązujących zasad i regulaminów szkolnych, w tym regulaminu pracowni komputerowej.",
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
  "Publikacja wizerunku (zdjęcia, transmisja) wymaga odrębnej zgody zbieranej przez szkołę.",
  `Kontakt w sprawie danych: ${EVENT.dpoContact}.`,
];
