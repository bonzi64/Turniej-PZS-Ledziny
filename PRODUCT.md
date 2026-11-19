# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Uczniowie PZS Lędziny** (szkoła ponadpodstawowa, ok. 15–19 lat). Kapitan zgłasza drużynę 5 + 1 rezerwowy, najczęściej z telefonu, czasem ze szkolnego komputera. Reszta drużyny sprawdza listę drużyn, regulamin i drabinkę.
- **Widzowie w dniu turnieju**: drabinka i wyniki na rzutniku oraz na telefonach.
- **Nauczyciele-organizatorzy** (Ilona Kaiser, Maksymilian Woźny, Kacper Dejas) w panelu `/admin`: weryfikacja zgłoszeń, drabinka, wyniki, godziny meczów, zdjęcia, konta, eksport CSV, anonimizacja.

## Product Purpose

Strona zapisów i obsługi jednodniowego Szkolnego Turnieju E-sportowego Powiatowego Zespołu Szkół w Lędzinach w **League of Legends**. Prowadzi turniej od zapisów do finału: regulamin z blokadą czasową, formularz zgłoszenia, lista drużyn, drabinka na żywo, galeria zdjęć po turnieju. Sukces: 8 kompletnych, zweryfikowanych drużyn przed 27.11.2026 i płynny dzień turnieju bez papierowych list.

## Positioning

Szkolne wydarzenie, które wygląda i zachowuje się jak klient gry, w którą uczniowie grają na co dzień, a jednocześnie pilnuje RODO: publicznie widać tylko nicki, nazwę drużyny i klasę.

## Operating Context

- Turniej: **piątek 04.12.2026**, zbiórka 8:00, start 8:30, koniec najpóźniej 14:30. 8 drużyn, pojedyncza eliminacja (4 ćwierćfinały, 2 półfinały, finał). **Wszystkie mecze BO1, także finał** (decyzja z 18.11.2026, limit czasu).
- Zapisy do 27.11.2026, 23:59. Limit 8 drużyn; oczekujące i zatwierdzone zajmują slot.
- Mecze w szkolnej pracowni komputerowej. Każdy gra na **własnym koncie Riot**. Mecz to gra niestandardowa na Summoner's Rift w trybie Tournament Draft; bany i picki odbywają się w kliencie gry, nie na stronie.
- W dniu turnieju na rzutniku wyświetla się drabinka.
- Wcześniej ta sama strona obsługiwała wersję CS2 (kopia: `../turniejpzs-kopia-cs2-2026-11-18`, tag `cs2-final`). Turniej CS2 się nie odbędzie.

## Capabilities and Constraints

- Regulamin odblokowuje formularz po przewinięciu do końca i minimalnym czasie lektury (`RULES_MIN_SECONDS`, domyślnie 60 s); serwer sprawdza podpisany bilet.
- **Brak limitu wieku i brak papierowych zgód rodziców** (decyzja z 18.11.2026). Uczestniczyć może każdy uczeń PZS Lędziny.
- Pola zgłoszenia: nazwa i tag drużyny; dla każdego zawodnika Riot ID, imię, nazwisko, klasa; e-mail kapitana, Discord opcjonalnie; akceptacja regulaminu i klauzuli RODO.
- Anty-spam: honeypot, limit zgłoszeń z IP, blokada duplikatów.
- Brak veto map (to była funkcja CS2). Draft odbywa się w kliencie LoL.
- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, Prisma 7 + PostgreSQL. Dźwięki generowane przez Web Audio API.
- Język: wyłącznie polski.

## Brand Commitments

- Strona jest stylizowana na klient gry, w którą gra turniej. Dla LoL: klient League of Legends (hextech, złote ramki, granat). Wybór użytkownika z 18.11.2026: odświeżyć HUD, intro i resztę w tym świecie.
- Logo szkoły: `public/brand/pzs-logo.png`, `public/brand/pzs-logo-128.png`.
- Nazwa: „PZS E-SPORTS 2026”, „Turniej E-sportowy PZS Lędziny”.
- Strona nie może sugerować powiązania z Riot Games; w stopce informacja o znaku towarowym.
- Autor strony: bonzi64 (GitHub) w stopce.

## Evidence on Hand

- Dane drużyn, drabinki i zdjęć pochodzą z bazy. Nie wolno wymyślać drużyn, wyników ani nagród.
- Organizatorzy i e-mail kontaktowy: `src/content/event.ts`. Dane Inspektora Ochrony Danych i sala są jeszcze do uzupełnienia.
- Informacja o nagrodach: jeszcze nieustalona.

## Product Principles

1. Najpierw zapis drużyny: z każdego miejsca jedno kliknięcie do zapisów albo regulaminu.
2. Prywatność uczniów jest nienegocjowalna: dane osobowe tylko w panelu.
3. Klimat klienta gry nie może utrudniać zadania: formularz i drabinka mają być czytelne na telefonie i na rzutniku.
4. Prawdziwe stany zamiast ozdobników: liczba slotów, odliczanie, status zapisów pochodzą z danych.

## Accessibility & Inclusion

- Intro można pominąć (Esc, przycisk), a przy `prefers-reduced-motion` animacje są wyłączane.
- Pełna obsługa klawiaturą (zakładki, formularz, galeria), widoczny fokus.
- Czytelność na telefonie (formularz) i z daleka (drabinka na rzutniku).
