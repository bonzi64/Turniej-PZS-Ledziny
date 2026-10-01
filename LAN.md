# Turniej na LANie – ściąga

Plan na 4 grudnia: strona turnieju służy do veto map, drabinki i wyników, a mecze idą na własnym serwerze CS2 w szkolnej pracowni.

**Założenia**, na których opiera się ta ściąga:

- pracownia ma internet, bo klient CS2 wymaga zalogowania do Steama,
- każdy gra na własnym koncie Steam, zgodnie z regulaminem,
- dwa mecze idą naraz, czyli 20 stanowisk plus komputer sędziego z dwoma serwerami CS2.

## Harmonogram

Turniej musi skończyć się najpóźniej o 14:00–14:30, dlatego wszystkie mecze, łącznie z finałem, są w BO1. Drabinka ma 7 meczów: 4 ćwierćfinały, 2 półfinały i finał.

Mecz BO1 na MR12 trwa razem z veto i przygotowaniem serwera około godziny. Dogrywka może go wydłużyć o kilkanaście minut.

| Wariant | Stanowiska | Koniec przy starcie 8:30 |
| --- | --- | --- |
| jeden mecz naraz | 10 + serwer | ok. 15:30–16:00, za późno |
| dwa mecze naraz | 20 + serwer | ok. 12:30–13:00 |

Żeby zmieścić się w czasie, potrzebne są dwa mecze naraz. Przykładowy plan:

| Godzina | Serwer 1, port 27015 | Serwer 2, port 27016 |
| --- | --- | --- |
| 8:00 | zbiórka i sprawdzenie składów | |
| 8:30 | ćwierćfinał 1 | ćwierćfinał 2 |
| 9:30 | ćwierćfinał 3 | ćwierćfinał 4 |
| 10:30 | półfinał 1 | półfinał 2 |
| 11:45 | finał | |
| ok. 12:45 | koniec | |

Do 14:00 zostaje ponad godzina zapasu na dogrywki i opóźnienia. Oba serwery CS2 mogą chodzić na jednym mocnym komputerze. Godziny wpisz w panelu, wtedy pokażą się w drabince na stronie.

## Strona turnieju w dniu meczów

Najprościej zostawić stronę tam, gdzie działa przez cały okres zapisów, czyli w internecie. Zgłoszenia, konta i drabinka są w bazie w chmurze, więc nic nie trzeba przenosić.

- Na rzutniku warto wyświetlić drabinkę, czyli `/cs2#drabinka`, a w trakcie veto pokój meczu. Widzowie oglądają go bez logowania.
- Kapitanowie wpisują PIN-y na telefonie albo na stanowisku, zanim uruchomią CS2.

> [!WARNING]
> Limity prób są liczone na adres IP. Szkolna sieć zwykle wychodzi do internetu przez jeden publiczny adres, więc wszystkie komputery w pracowni dzielą jeden limit.
>
> - Po 8 błędnych PIN-ach do jednego meczu wpisywanie PIN-u do tego meczu jest zablokowane do 10 minut od pierwszej błędnej próby. Dotyczy to wszystkich w sieci, także kapitanów. Poprawny PIN zeruje licznik.
> - Po 8 nieudanych logowaniach do panelu logowanie jest zablokowane do 15 minut od pierwszej próby.
>
> Szybkie odblokowanie: `npm run db:studio`, tabela `RateLimit`, usuń wiersz z kluczem `pin:…` albo `login:…`. Blokady nie omija telefon na danych komórkowych, bo ma inny adres IP.

**Wariant ze stroną w pracowni.** Jeśli każdy komputer ma mieć własny limit, uruchom aplikację na komputerze w pracowni, połączoną z tą samą bazą w chmurze. Postaw ją za reverse proxy, które przekazuje nagłówek `X-Forwarded-For` z lokalnym adresem każdego stanowiska. Aplikację wystaw tylko na `127.0.0.1`, żeby nikt nie ominął proxy.

```bash
npm ci && npm run build
npm start -- -H 127.0.0.1 -p 3000
```

Caddyfile, Caddy sam dodaje `X-Forwarded-For`:

```
:80 {
  reverse_proxy 127.0.0.1:3000
}
```

W `.env` ustaw `NEXT_PUBLIC_SITE_URL` na adres komputera w sieci, np. `http://192.168.1.10`. W zaporze Windows otwórz port 80.

## Przebieg meczu krok po kroku

**Przed meczem**

1. W panelu, w zakładce **Drabinka i PIN-y**, ustaw godzinę meczu. Wszystkie mecze są BO1.
2. Drużyny siadają przy stanowiskach. Drużyna nieobecna 10 minut po wyznaczonej godzinie przegrywa walkowerem.
3. Sprawdź składy z listą w panelu. W grze muszą być te same nicki co w zgłoszeniu.

**Veto map na stronie**

1. Przy meczu kliknij **Wydaj PIN-y**. Każdy kapitan dostaje swój 6-cyfrowy PIN, najlepiej na kartce. Drużyna A to górna drużyna w parze i zawsze zaczyna veto.
2. Kapitanowie otwierają `/cs2`, zakładkę **Map veto**, pokój swojego meczu, i wpisują PIN. Zegar tury rusza, gdy obaj są w pokoju.
3. Na każdy ruch jest 45 sekund. Po tym czasie system sam banuje albo wybiera losową mapę.

Kolejność banów: A, B, A, B, A, B. Z 7 map zostaje jedna, decider, i na niej gracie.

Gdy PIN wycieknie, kliknij **Nowe PIN-y**. Unieważnia to stare sesje kapitanów. Gdy veto pójdzie źle, **Reset veto** czyści wszystkie ruchy.

**Strony CT i T**

Na każdym meczu stronę startową wyłania runda nożowa. Strona turnieju tego nie rozstrzyga, robi to sędzia na serwerze.

**Mecz na serwerze**

1. W konsoli serwera zmień mapę, np. `changelevel de_mirage`, a potem wpisz `exec turniej`.
2. Gracze łączą się przez konsolę gry: `connect 192.168.1.10:27015; password HASLO`.
3. Ustaw nazwy drużyn. `mp_teamname_1` to drużyna, która zaczyna jako CT, a `mp_teamname_2` jako T.
4. Wpisz `exec noze`, żeby zacząć rundę nożową. Zwycięzcy wybierają stronę. Jeśli chcą ją zmienić, obie drużyny przechodzą na drugą stronę klawiszem M. Potem wpisz `exec live`.
5. Pauza techniczna, maks. 10 minut na mecz: `mp_pause_match` i `mp_unpause_match`. Pauza zaczyna się od najbliższego freezetime. Każda drużyna ma też 4 pauzy taktyczne po 30 sekund, które bierze sama przez głosowanie w grze.

**Po meczu**

Wpisz wynik w panelu w rundach, np. 13:9. Remisów nie ma, a zwycięzca sam przechodzi do następnej rundy.

## Serwer CS2

**Instalacja** przez SteamCMD, ok. 60 GB:

```
steamcmd +force_install_dir C:\cs2-server +login anonymous +app_update 730 validate +quit
```

**Uruchomienie** w trybie competitive i trybie LAN:

```
C:\cs2-server\game\bin\win64\cs2.exe -dedicated -port 27015 +game_type 0 +game_mode 1 +sv_lan 1 +map de_mirage
```

Drugi serwer uruchamiasz tak samo, z `-port 27016`.

**Kody map** do `changelevel`:

| Mapa | Kod |
| --- | --- |
| Ancient | `de_ancient` |
| Anubis | `de_anubis` |
| Cache | `de_cache` |
| Dust II | `de_dust2` |
| Inferno | `de_inferno` |
| Mirage | `de_mirage` |
| Nuke | `de_nuke` |

**Konfiguracje** wrzuć do `C:\cs2-server\game\csgo\cfg\`. Hasło serwera ustaw własne i nie wrzucaj go do repo.

`turniej.cfg`, wpisywany po każdej zmianie mapy:

```
// regulamin: MR12, dogrywka MR3 z budżetem 10 000 $
mp_maxrounds 24
mp_overtime_enable 1
mp_overtime_maxrounds 6
mp_overtime_startmoney 10000
// 4 pauzy taktyczne po 30 s na drużynę
mp_team_timeout_max 4
mp_team_timeout_time 30
// składy pilnuje sędzia
mp_autoteambalance 0
mp_limitteams 0
// rozgrzewka trwa, dopóki sędzia jej nie zakończy
mp_warmup_pausetimer 1
sv_lan 1
sv_password "HASLO"
```

`noze.cfg`, runda nożowa:

```
mp_ct_default_secondary ""
mp_t_default_secondary ""
mp_give_player_c4 0
mp_startmoney 0
mp_warmup_end
mp_restartgame 1
```

`live.cfg`, start meczu:

```
mp_ct_default_secondary weapon_hkp2000
mp_t_default_secondary weapon_glock
mp_give_player_c4 1
mp_startmoney 800
mp_warmup_end
mp_restartgame 1
```

> [!IMPORTANT]
> Zmienne CS2 zmieniają się z aktualizacjami gry. Przetestuj cały przebieg, z veto, nożem, pauzą i dogrywką, kilka dni przed turniejem.

## Checklista

**Kilka dni wcześniej**

- [ ] Uzupełnić pola w `src/content/event.ts`: salę, opiekunów, e-mail i IOD.
- [ ] Założyć konta nauczycielom w panelu.
- [ ] Zainstalować i zaktualizować CS2 na wszystkich stanowiskach.
- [ ] Sprawdzić, czy szkolna sieć nie blokuje Steama.
- [ ] Rozegrać mecz testowy na serwerze z configami.
- [ ] Rozstawić drabinkę i ustawić godziny meczów.

**Rano w dniu turnieju**

- [ ] Zaktualizować serwer, czyli powtórzyć `app_update 730`, i klienty CS2. Różne wersje nie połączą się ze sobą.
- [ ] Uruchomić oba serwery, na portach 27015 i 27016, i sprawdzić `connect` do każdego z nich.
- [ ] Włączyć rzutnik z drabinką.
- [ ] Przygotować kartki na PIN-y.

**Po turnieju**

- [ ] Po 31.12.2026 kliknąć **Anonimizuj dane** na pulpicie panelu.
