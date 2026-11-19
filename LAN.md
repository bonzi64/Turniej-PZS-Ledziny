# Turniej w pracowni – ściąga

Plan na 4 grudnia: strona turnieju służy do drabinki i wyników, a mecze League of Legends idą w szkolnej pracowni jako gry niestandardowe.

**Założenia**, na których opiera się ta ściąga:

- pracownia ma internet, bo klient LoL łączy się z serwerami Riot (gra nie działa w trybie offline),
- każdy gra na własnym koncie Riot, zgodnie z regulaminem,
- jeden mecz to 10 stanowisk, plus komputer sędziego, który może oglądać grę jako widz.

## Harmonogram

Turniej musi skończyć się najpóźniej o 14:00–14:30, dlatego wszystkie mecze, łącznie z finałem, są w BO1. Drabinka ma 7 meczów: 4 ćwierćfinały, 2 półfinały i finał.

Czas meczu zależy od tego, jak wyrównane są drużyny:

| Mecz | Czas gry | Razem z lobby i draftem |
| --- | --- | --- |
| jednostronny | ok. 22 min | ok. 35 min |
| wyrównany | ok. 30 min | ok. 45 min |
| długi | 38 min i więcej | ok. 55 min i więcej |

Szacunek przyjmuje ok. 10 minut na zebranie drużyn w lobby i Tournament Draft (10 banów i 10 wyborów).

Koniec turnieju przy starcie o 8:30:

| Wariant | Same jednostronne mecze | Typowo | Same długie mecze |
| --- | --- | --- | --- |
| jeden mecz naraz | ok. 12:35 | ok. 13:55 | ok. 14:55 |
| dwa mecze naraz | ok. 10:50 | ok. 11:40 | ok. 12:10 |

„Typowo” oznacza wyrównane ćwierćfinały i półfinały oraz długi finał. Jeden mecz naraz mieści się w planie, ale zostawia mało zapasu. Jeśli pracownia ma 20 stanowisk, ćwierćfinały i półfinały warto grać po dwa naraz.

Przykładowy plan przy jednym meczu naraz, do wpisania w panelu:

| Mecz | Start |
| --- | --- |
| zbiórka i sprawdzenie składów | 8:00 |
| ćwierćfinał 1 | 8:30 |
| ćwierćfinał 2 | 9:15 |
| ćwierćfinał 3 | 10:00 |
| ćwierćfinał 4 | 10:45 |
| półfinał 1 | 11:30 |
| półfinał 2 | 12:15 |
| finał | 13:00 |
| koniec | ok. 13:45 |

Godziny są orientacyjne, bo kolejny mecz zaczyna się zaraz po poprzednim. Niech wszystkie drużyny czekają na sali od rana. Walkower liczy się od godziny wpisanej w panelu, więc przy wcześniejszym starcie nie karz drużyny, która jeszcze nie dotarła.

## Strona turnieju w dniu meczów

Najprościej zostawić stronę tam, gdzie działa przez cały okres zapisów, czyli w internecie. Zgłoszenia, konta i drabinka są w bazie w chmurze, więc nic nie trzeba przenosić.

- Na rzutniku warto wyświetlić drabinkę, czyli `/#drabinka`. Wyniki pojawiają się tam po wpisaniu w panelu.
- Panel organizatora działa na telefonie, więc sędzia może wpisywać wyniki od razu po meczu.

> [!WARNING]
> Limit nieudanych logowań do panelu jest liczony na adres IP. Szkolna sieć zwykle wychodzi do internetu przez jeden publiczny adres, więc po 8 błędnych hasłach z pracowni logowanie jest zablokowane dla całej sieci do 15 minut. Szybkie odblokowanie: `npm run db:studio`, tabela `RateLimit`, usuń wiersz z kluczem `login:…`. Blokady nie ma telefon na danych komórkowych, bo ma inny adres IP.

## Przebieg meczu krok po kroku

**Przed meczem**

1. W panelu, w zakładce **Drabinka**, ustaw godzinę meczu. Wszystkie mecze są BO1.
2. Drużyny siadają przy stanowiskach i logują się na własne konta Riot. Drużyna nieobecna 10 minut po wyznaczonej godzinie przegrywa walkowerem.
3. Sprawdź składy z listą w panelu. Riot ID w grze muszą się zgadzać ze zgłoszeniem.

**Lobby meczu**

1. Kapitan drużyny A (górna drużyna w parze) albo sędzia tworzy grę: **Graj → Utwórz własną grę**.
2. Ustawienia: mapa **Summoner's Rift**, tryb **Tournament Draft**, drużyny po 5 graczy, widzowie **tylko z lobby**. Nazwa gry np. `PZS QF1`, hasło własne, podane tylko obu drużynom i sędziemu.
3. Drużyna A wybiera stronę, niebieską albo czerwoną, i obie drużyny przechodzą na swoje strony w lobby. Sędzia dołącza jako widz.
4. Start gry, draft w kliencie: najpierw bany, potem wybory bohaterów. Strona turnieju w tym nie uczestniczy.

**W trakcie gry**

- Pauzę techniczną zgłasza się sędziemu, który pauzuje grę komendą `/pause` na czacie (wznowienie: `/unpause`). Łączny limit to 10 minut na drużynę w meczu.
- Remake jest dozwolony, jeśli zawodnik rozłączył się przed 3. minutą i przed pierwszym zabójstwem. Wtedy grę zamyka się i zakłada od nowa, z tym samym draftem, jeśli obie drużyny się zgodzą.

**Po meczu**

Wpisz wynik w panelu jako 1:0 dla zwycięzcy. Remisów nie ma, a zwycięzca sam przechodzi do następnej rundy.

## Klient LoL na komputerach szkolnych

- Klient League of Legends instaluje się razem z ochroną przed oszustwami Riot Vanguard. Instalacja wymaga uprawnień administratora i ponownego uruchomienia komputera.
- Jeśli komputery w pracowni mają program przywracający stan po restarcie (np. Deep Freeze), zainstaluj i zaktualizuj grę w trybie odmrożonym, zanim go włączysz. Inaczej Vanguard i aktualizacje znikną po każdym restarcie.
- Aktualizacje gry potrafią mieć kilka GB. Zaktualizuj klienta na wszystkich stanowiskach dzień wcześniej, a rano tylko sprawdź, czy nie ma nowej łatki.

> [!IMPORTANT]
> Rozegraj mecz testowy z dwiema pełnymi drużynami kilka dni przed turniejem: logowanie na konta uczniów, lobby z hasłem, Tournament Draft, pauza i remake. Sprawdź też, czy szkolna sieć nie blokuje klienta Riot.

## Checklista

**Kilka dni wcześniej**

- [ ] Uzupełnić pola w `src/content/event.ts`: salę i IOD.
- [ ] Założyć konta nauczycielom w panelu.
- [ ] Zainstalować i zaktualizować klienta LoL z Riot Vanguard na wszystkich stanowiskach.
- [ ] Sprawdzić, czy szkolna sieć nie blokuje klienta Riot.
- [ ] Rozegrać mecz testowy w lobby Tournament Draft.
- [ ] Rozstawić drabinkę i ustawić godziny meczów.
- [ ] Przypomnieć kapitanom, że każdy gra na własnym koncie Riot i musi znać do niego hasło.

**Rano w dniu turnieju**

- [ ] Uruchomić klienta na wszystkich stanowiskach i pobrać ewentualną łatkę.
- [ ] Włączyć rzutnik z drabinką.
- [ ] Przygotować kartki z nazwą i hasłem lobby dla każdego meczu.

**Po turnieju**

- [ ] Dodać zdjęcia w panelu (zakładka **Zdjęcia**) – tylko osób ze zgodą na publikację wizerunku.
- [ ] Po 31.12.2026 kliknąć **Anonimizuj dane** na pulpicie panelu.
