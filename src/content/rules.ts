import { EVENT } from "@/content/event";
import type { GameSlug } from "@/lib/games";
import { MAX_TEAMS } from "@/lib/tournament";

export type RuleChapter = {
  id: string;
  title: string;
  points: string[];
};

export const COMMON_RULES: RuleChapter[] = [
  {
    id: "ogolne",
    title: "Postanowienia ogólne",
    points: [
      `Organizatorem turnieju jest ${EVENT.school}. Nad przebiegiem rozgrywek czuwają nauczyciele-opiekunowie wskazani przez dyrekcję szkoły.`,
      `Turniej odbywa się ${EVENT.dateLabel} (${EVENT.weekday}) w budynku szkoły, ${EVENT.address}. Jest wydarzeniem szkolnym – obowiązuje Statut Szkoły.`,
      "W turnieju biorą udział wyłącznie uczniowie PZS Lędziny. Uczeń może reprezentować tylko jedną drużynę.",
      "Udział jest bezpłatny i dobrowolny.",
      `Obowiązuje limit ${MAX_TEAMS} drużyn. O miejscu decyduje kolejność zgłoszeń zatwierdzonych przez organizatora.`,
    ],
  },
  {
    id: "zgloszenia",
    title: "Zgłoszenia i składy",
    points: [
      "Drużyna liczy 5 zawodników podstawowych i maksymalnie 1 rezerwowego. Kapitan jest osobą kontaktową drużyny.",
      `Zgłoszenia przyjmujemy wyłącznie przez formularz na tej stronie do ${EVENT.registrationClosesLabel}.`,
      "Formularz wymaga podania imienia, nazwiska, klasy i nicku każdego zawodnika oraz adresu e-mail kapitana (Discord opcjonalnie).",
      "Każde zgłoszenie weryfikuje nauczyciel na podstawie listy uczniów. Zgłoszenia z nieprawdziwymi danymi odrzucamy bez możliwości poprawy.",
      "Nazwy drużyn i nicki nie mogą zawierać wulgaryzmów, treści obraźliwych, politycznych ani reklamowych. Organizator może zażądać ich zmiany.",
      "Zmiany w składzie po zatwierdzeniu są możliwe wyłącznie za zgodą organizatora, najpóźniej dzień przed turniejem.",
    ],
  },
  {
    id: "fair-play",
    title: "Fair play i kultura gry",
    points: [
      "Szanujemy przeciwników, sędziów i opiekunów – przed meczem i po meczu, w grze i poza nią.",
      "Zakazane są: cheaty, skrypty, makra, wykorzystywanie błędów gry (exploity), ghosting oraz gra na cudzym koncie.",
      "Obelgi, rasizm, seksizm, spam i trashtalk przekraczający granice kultury skutkują karą – także na czacie gry i na Discordzie turnieju.",
      "Każdy zawodnik gra na własnym koncie. Konto z aktywną blokadą lub banem wyklucza z udziału.",
      "Po każdym meczu obowiązuje GG – na czacie i na żywo.",
      "Spory rozstrzyga sędzia główny (nauczyciel). Jego decyzja jest ostateczna.",
    ],
  },
  {
    id: "rygor",
    title: "Rygor szkolny",
    points: [
      "Turniej jest zajęciem szkolnym – obowiązuje Statut Szkoły, regulamin pracowni komputerowej i polecenia nauczycieli.",
      "Zakaz instalowania oprogramowania i zmieniania konfiguracji sprzętu szkolnego bez zgody opiekuna pracowni.",
      "Uczestnicy odpowiadają za szkody wyrządzone umyślnie lub przez rażące niedbalstwo.",
      "Jedzenie i napoje wyłącznie w wyznaczonej strefie, poza stanowiskami komputerowymi.",
      "Stopniowanie kar: ostrzeżenie → utrata rundy lub mapy → walkower → dyskwalifikacja drużyny. Naruszenia mogą wpłynąć na ocenę zachowania zgodnie ze Statutem.",
      "Drużyna nieobecna 10 minut po wyznaczonej godzinie meczu przegrywa walkowerem.",
      "Zasady zwolnienia z zajęć lekcyjnych ustala dyrekcja. Obecność potwierdza się u opiekuna przed pierwszym meczem.",
    ],
  },
  {
    id: "rodo",
    title: "Ochrona danych osobowych (RODO)",
    points: [
      `Administratorem danych osobowych jest ${EVENT.school}, ${EVENT.address}.`,
      "Dane (imię, nazwisko, klasa, nick, e-mail i Discord kapitana) przetwarzamy wyłącznie w celu organizacji turnieju i weryfikacji uczestników – na podstawie zgody (art. 6 ust. 1 lit. a RODO).",
      "Publicznie na stronie pokazujemy tylko: nazwę drużyny, nicki zawodników i klasę. Imiona, nazwiska i dane kontaktowe widzą wyłącznie organizatorzy w zabezpieczonym panelu.",
      `Dane przechowujemy do ${EVENT.dataRetention}, a następnie je usuwamy. Wyniki (nazwa drużyny, nicki, klasa) mogą pozostać w archiwum turnieju.`,
      "Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz cofnięcia zgody w dowolnym momencie (bez wpływu na wcześniejsze przetwarzanie), a także prawo skargi do Prezesa UODO.",
      "Zgłaszając uczniów niepełnoletnich, potwierdzasz, że ich rodzice lub opiekunowie prawni wiedzą o udziale i wyrazili na niego zgodę.",
      "Publikacja wizerunku (zdjęcia, transmisja) wymaga odrębnej zgody zbieranej przez szkołę.",
      `Kontakt w sprawie danych: ${EVENT.dpoContact}.`,
    ],
  },
];

export const GAME_RULES: Record<GameSlug, RuleChapter> = {
  cs2: {
    id: "mecze",
    title: "Counter-Strike 2 – zasady meczowe",
    points: [
      "System pojedynczej eliminacji dla 8 drużyn. Wszystkie mecze, łącznie z finałem, rozgrywane są w formacie BO1.",
      "Ustawienia serwera: MR12 (24 rundy), dogrywka MR3 z budżetem 10 000 $, reszta według standardowego configu turniejowego.",
      "Pula map: Active Duty (stan na lipiec 2026) – Ancient, Anubis, Cache, Dust II, Inferno, Mirage, Nuke.",
      "Veto odbywa się w panelu na stronie. Kapitanowie logują się PIN-em otrzymanym od organizatora. Drużyna A zawsze zaczyna.",
      "Drużyny naprzemiennie banują mapy, aż zostanie jedna – decider. Na niej rozgrywany jest mecz.",
      "Czas na ruch jest ograniczony (domyślnie 45 s). Po jego upływie system sam banuje lub wybiera losową mapę z puli.",
      "Stronę startową wyłania runda nożowa.",
      "Każda drużyna ma 4 pauzy taktyczne po 30 s. Pauzę techniczną (maks. 10 min) zgłasza się sędziemu.",
    ],
  },
};
