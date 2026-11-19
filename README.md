<p align="center">
  <img src="public/brand/pzs-logo-128.png" alt="Logo Powiatowego Zespołu Szkół w Lędzinach" width="96">
</p>

<h1 align="center">PZS E-SPORTS 2026</h1>

<p align="center">
  Strona zapisów i obsługi Szkolnego Turnieju E-sportowego<br>
  Powiatowego Zespołu Szkół w Lędzinach
</p>

<p align="center">
  <b>League of Legends</b> · 8 drużyn · <b>piątek, 4 grudnia 2026</b> · zbiórka 8:00, start 8:30, koniec do 14:30
</p>

---

Strona prowadzi turniej od zapisów aż do finału. Uczniowie zgłaszają drużyny przez formularz, nauczyciele sprawdzają zgłoszenia w zabezpieczonym panelu, a w dniu turnieju na stronie widać drabinkę i wyniki na żywo. Wygląd nawiązuje do menu głównego klienta League of Legends: granat, metalowe złote ramki, rdzeń hextech z kryształem i iskrami, esportowe wersaliki Big Shoulders Display, złoty kursor hextech i przycisk „Zapisz drużynę” w miejscu przycisku „Graj”.

Turniej od początku miał obejmować jedną grę, wybraną przez uczniów w głosowaniu. Głosowanie wygrało Counter-Strike 2, ale turniej CS2 się nie odbędzie, więc strona wróciła do League of Legends. Wersja CS2 jest zachowana w tagu `cs2-final` i w kopii `turniejpzs-kopia-cs2-2026-11-18`.

## Co potrafi strona

### Dla uczniów

- **Intro jak start klienta.** Rdzeń hextech składa się w takt ładowania, a po kliknięciu przelatuje na baner strony startowej. Kliknięcie włącza pełny ekran, `Esc` pomija intro.
- **Regulamin z blokadą.** Formularz zapisów odblokowuje się dopiero wtedy, gdy regulamin zostanie przewinięty do końca i minie minimalny czas lektury, domyślnie 60 sekund. Zegar liczy tylko wtedy, gdy regulamin jest widoczny na ekranie.
- **Zgłoszenie drużyny.** Pięciu graczy i jeden rezerwowy. Dla każdego Riot ID, imię, nazwisko i klasa, a dla kapitana także e-mail. Na telefonie każdy zawodnik ma własną kartę z polami zamiast szerokiej tabeli, a portret gracza wypełnia się inicjałami w trakcie wpisywania Riot ID, jak w lobby gry.
- **Licznik zapisów na żywo** na banerze i w panelu drużyn po prawej, który wygląda jak lista znajomych w kliencie.
- **Lista drużyn i drabinka.** Zatwierdzone składy, pary meczowe, godziny meczów i wyniki.
- **Dźwięk.** Efekty i muzyka są syntezowane w przeglądarce (bez plików), z osobną głośnością.

### Dla nauczycieli

- **Panel organizatora** pod adresem `/admin`, dostępny tylko po zalogowaniu.
- **Weryfikacja zgłoszeń** z pełnymi danymi uczniów i przyciskami „Zatwierdź” oraz „Odrzuć”.
- **Drabinka** rozstawiana ręcznie albo losowo. Po wpisaniu wyniku zwycięzca sam przechodzi do następnej rundy.
- **Eksport do Excela** z listą wszystkich zgłoszonych uczniów.
- **Osobne konta dla nauczycieli** z dwiema rolami: Organizator i Administrator.
- **Zdjęcia z turnieju** dodawane w panelu i pokazywane na stronie `/zdjecia`.
- **Anonimizacja danych** po turnieju jednym przyciskiem.

## Ochrona danych uczniów (RODO)

> [!IMPORTANT]
> Imiona i nazwiska uczniów nigdy nie pojawiają się na publicznej stronie. Widzą je tylko zalogowani organizatorzy.

| Widoczne publicznie | Widoczne tylko w panelu organizatora |
| --- | --- |
| nazwa i tag drużyny | imię i nazwisko |
| Riot ID graczy | e-mail kapitana |
| klasa | Discord kapitana |

- Klauzula informacyjna jest na stronie `/rodo`. Przy zgłoszeniu kapitan akceptuje regulamin i zgodę na przetwarzanie danych.
- W turnieju LoL nie ma limitu wieku ani papierowych zgód rodziców. Może grać każdy uczeń PZS Lędziny.
- Publiczna część strony korzysta z osobnych zapytań do bazy, które w ogóle nie pobierają imion, nazwisk ani kontaktów.
- Dane są przechowywane do 31.12.2026. Potem administrator anonimizuje je w panelu. Imiona, nazwiska, e-maile i Discordy znikają, a nicki, klasy, nazwy drużyn i wyniki zostają w archiwum turnieju.

## Instrukcja dla organizatorów

**Przed turniejem**

1. Administrator zakłada konta pozostałym nauczycielom w zakładce **Konta**. Każdy może potem zmienić swoje hasło w tej samej zakładce.
2. W zakładce **Zgłoszenia** sprawdzacie każdą drużynę z listą uczniów i klikacie **Zatwierdź** albo **Odrzuć**. Odrzucenie zwalnia miejsce dla kolejnej drużyny. Przy każdym zgłoszeniu widać e-mail i Discord kapitana.
3. Link **Eksport CSV** w zakładce Zgłoszenia pobiera listę uczniów. Excel otwiera ten plik bez żadnej konwersji.

Zgłoszenia złożone wcześniej na turniej CS2 zostały w bazie, ale nie pojawiają się na stronie ani w panelu. Drużyny z CS2, które chcą zagrać w LoL, muszą zgłosić się od nowa. Stare linki `/cs2` prowadzą na stronę główną.

**W dniu turnieju**

1. W zakładce **Drabinka** utwórz drabinkę. Drużyny rozstawisz ręcznie albo przyciskiem **Losuj rozstawienie**.
2. Mecze rozgrywacie w kliencie gry jako gry niestandardowe w trybie Tournament Draft. Strona nie bierze udziału w draftcie.
3. Po meczu wpisz wynik, np. 1:0. Zwycięzca automatycznie trafia do następnej rundy.

Szczegółowy przebieg meczu w pracowni, z harmonogramem i ustawieniami lobby, jest w pliku [LAN.md](LAN.md).

**Po turnieju**

1. W zakładce **Zdjęcia** dodajesz zdjęcia z turnieju. Przeglądarka zmniejsza je i usuwa dane z aparatu, np. lokalizację GPS. Publikuj tylko osoby, które mają zgodę szkoły na publikację wizerunku.
2. Po 31.12.2026 administrator klika **Anonimizuj dane** na pulpicie panelu.

| Rola | Uprawnienia |
| --- | --- |
| Organizator | zgłoszenia, eksport CSV, drabinka, wyniki, zdjęcia, zmiana własnego hasła |
| Administrator | wszystko powyżej oraz konta nauczycieli, trwałe usuwanie zgłoszeń i anonimizacja danych |

## Do uzupełnienia przed startem zapisów

W pliku [src/content/event.ts](src/content/event.ts) zostały pola w nawiasach kwadratowych:

- `venue`: sala lub pracownie,
- `dpoContact`: dane Inspektora Ochrony Danych szkoły.

Warto też sprawdzić godziny, termin zapisów (obecnie 27.11.2026, 23:59) i treść regulaminu w [src/content/rules.ts](src/content/rules.ts). Klauzulę RODO najlepiej skonsultować z Inspektorem Ochrony Danych szkoły.

## Licencja

Kod jest udostępniony wyłącznie do wglądu. Wszelkie prawa zastrzeżone: bez pisemnej zgody autora nie wolno go kopiować, modyfikować, rozpowszechniać ani uruchamiać. Szczegóły są w pliku [LICENSE](LICENSE).

## Znaki towarowe

League of Legends jest znakiem towarowym Riot Games, Inc. Turniej jest wydarzeniem szkolnym i nie jest powiązany z Riot Games. Strona nie używa grafik ani logotypów Riot Games.

Fonty: Big Shoulders Display i Barlow Semi Condensed, oba na licencji SIL Open Font License 1.1 (hostowane z `public/fonts`).
