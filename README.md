<p align="center">
  <img src="public/brand/pzs-logo-128.png" alt="Logo Powiatowego Zespołu Szkół w Lędzinach" width="96">
</p>

<h1 align="center">PZS E-SPORTS 2026</h1>

<p align="center">
  Strona zapisów i obsługi Szkolnego Turnieju E-sportowego<br>
  Powiatowego Zespołu Szkół w Lędzinach
</p>

<p align="center">
  <b>Counter-Strike 2</b> · 8 drużyn · <b>piątek, 4 grudnia 2026</b> · zbiórka 8:00, start 8:30
</p>

---

Strona prowadzi turniej od zapisów aż do finału. Uczniowie zgłaszają drużyny przez formularz, nauczyciele sprawdzają zgłoszenia w zabezpieczonym panelu, a w dniu turnieju na stronie widać drabinkę i wybór map na żywo. Wygląd nawiązuje do klasycznego Counter-Strike 1.6 i Steama.

Turniej od początku miał obejmować jedną grę, wybraną przez uczniów w głosowaniu. Żeby strona była gotowa niezależnie od wyniku, powstała w trzech wersjach: dla Counter-Strike 2, Valoranta i League of Legends. Głosowanie wygrało CS2, więc dwie pozostałe wersje zostały usunięte.

## Co potrafi strona

### Dla uczniów

- **Regulamin z blokadą.** Formularz zapisów odblokowuje się dopiero wtedy, gdy regulamin zostanie przewinięty do końca i minie minimalny czas lektury, domyślnie 60 sekund. Zegar liczy tylko wtedy, gdy regulamin jest widoczny na ekranie.
- **Zgłoszenie drużyny.** Pięciu graczy i jeden rezerwowy. Dla każdego nick Steam, imię, nazwisko i klasa, a dla kapitana także e-mail.
- **Licznik zapisów na żywo.** Na stronie widać, ile z 8 miejsc jest już zajętych.
- **Lista drużyn i drabinka.** Zatwierdzone składy, pary meczowe, godziny meczów i wyniki.
- **Wybór map jak na FACEIT.** Kapitanowie na zmianę odrzucają mapy w pokoju meczu, a widzowie oglądają to na żywo, bez logowania.

### Dla nauczycieli

- **Panel organizatora** pod adresem `/admin`, dostępny tylko po zalogowaniu.
- **Weryfikacja zgłoszeń** z pełnymi danymi uczniów i przyciskami „Zatwierdź” oraz „Odrzuć”.
- **Drabinka** rozstawiana ręcznie albo losowo. Po wpisaniu wyniku zwycięzca sam przechodzi do następnej rundy.
- **PIN-y dla kapitanów** do pokoju wyboru map, wydawane jednym kliknięciem przy każdym meczu.
- **Eksport do Excela** z listą wszystkich zgłoszonych uczniów.
- **Osobne konta dla nauczycieli** z dwiema rolami: Organizator i Administrator.
- **Anonimizacja danych** po turnieju jednym przyciskiem.

## Ochrona danych uczniów (RODO)

> [!IMPORTANT]
> Imiona i nazwiska uczniów nigdy nie pojawiają się na publicznej stronie. Widzą je tylko zalogowani organizatorzy.

| Widoczne publicznie | Widoczne tylko w panelu organizatora |
| --- | --- |
| nazwa i tag drużyny | imię i nazwisko |
| nicki graczy | e-mail kapitana |
| klasa | Discord kapitana |

- Klauzula informacyjna jest na stronie `/rodo`. Przy zgłoszeniu kapitan akceptuje regulamin, zgodę na przetwarzanie danych i oświadczenie, że rodzice osób niepełnoletnich zgodzili się na udział.
- Publiczna część strony korzysta z osobnych zapytań do bazy, które w ogóle nie pobierają imion, nazwisk ani kontaktów.
- Dane są przechowywane do 31.12.2026. Potem administrator anonimizuje je w panelu. Imiona, nazwiska, e-maile i Discordy znikają, a nicki, klasy, nazwy drużyn i wyniki zostają w archiwum turnieju.

## Instrukcja dla organizatorów

**Przed turniejem**

1. Administrator zakłada konta pozostałym nauczycielom w zakładce **Konta**. Każdy może potem zmienić swoje hasło w tej samej zakładce.
2. W zakładce **Zgłoszenia** sprawdzacie każdą drużynę z listą uczniów i klikacie **Zatwierdź** albo **Odrzuć**. Odrzucenie zwalnia miejsce dla kolejnej drużyny. Przy każdym zgłoszeniu widać e-mail i Discord kapitana.
3. Link **Eksport CSV** w zakładce Zgłoszenia pobiera listę uczniów. Excel otwiera ten plik bez żadnej konwersji.

**W dniu turnieju**

1. W zakładce **Drabinka i PIN-y** utwórz drabinkę. Drużyny rozstawisz ręcznie albo przyciskiem **Losuj rozstawienie**.
2. Przy meczu kliknij **Wydaj PIN-y** i przekaż każdemu kapitanowi jego 6-cyfrowy PIN.
3. Kapitanowie otwierają pokój meczu, wpisują PIN-y i na zmianę odrzucają mapy. Jeśli kapitan nie zdąży w wyznaczonym czasie, domyślnie 45 sekund, system wybierze za niego.
4. Po meczu wpisz wynik. Zwycięzca automatycznie trafia do następnej rundy.

Szczegółowy przebieg meczu na LANie, z rundą nożową i konfiguracją serwera CS2, jest w pliku [LAN.md](LAN.md).

**Po turnieju**

1. Po 31.12.2026 administrator klika **Anonimizuj dane** na pulpicie panelu.

| Rola | Uprawnienia |
| --- | --- |
| Organizator | zgłoszenia, eksport CSV, drabinka, wyniki, PIN-y, zmiana własnego hasła |
| Administrator | wszystko powyżej oraz konta nauczycieli, trwałe usuwanie zgłoszeń i anonimizacja danych |

## Do uzupełnienia przed startem zapisów

W pliku [src/content/event.ts](src/content/event.ts) zostały pola w nawiasach kwadratowych:

- `venue`: sala lub pracownie,
- `organizers`: opiekunowie turnieju,
- `contactEmail`: e-mail organizatora,
- `dpoContact`: dane Inspektora Ochrony Danych szkoły.

Warto też sprawdzić godziny, termin zapisów (obecnie 27.11.2026, 23:59) i treść regulaminu w [src/content/rules.ts](src/content/rules.ts). Klauzulę RODO najlepiej skonsultować z Inspektorem Ochrony Danych szkoły.

## Licencja

Kod jest udostępniony wyłącznie do wglądu. Wszelkie prawa zastrzeżone: bez pisemnej zgody autora nie wolno go kopiować, modyfikować, rozpowszechniać ani uruchamiać. Szczegóły są w pliku [LICENSE](LICENSE).

## Znaki towarowe

Counter-Strike 2 jest znakiem towarowym Valve Corporation. Turniej jest wydarzeniem szkolnym i nie jest powiązany z Valve.

Font DejaVu Sans, używany w miniaturkach do udostępniania, jest dostępny na licencji Bitstream Vera / DejaVu ([src/assets/og/LICENSE-DejaVu.txt](src/assets/og/LICENSE-DejaVu.txt)).
