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

Grę wybrali uczniowie w głosowaniu. Pod uwagę brane były też Valorant i League of Legends, ale wygrało CS2.

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

---

## Dla programistów

**Technologie:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · Prisma 7 + PostgreSQL (`@prisma/adapter-pg`) · Zod · Web Audio API

### Uruchomienie lokalne

Wymagany Node.js 20.9 lub nowszy oraz baza PostgreSQL.

```bash
npm install                 # uruchamia też prisma generate
cp .env.example .env        # uzupełnij DATABASE_URL, AUTH_SECRET i SEED_ADMIN_*
npm run db:deploy           # tworzy tabele (prisma migrate deploy)
npm run db:seed             # zakłada pierwsze konto administratora
npm run dev                 # http://localhost:3000
```

Inne skrypty: `npm run lint`, `npm run typecheck`, `npm run db:studio`.

### Baza danych

Aplikacja łączy się zwykłym połączeniem Postgres, więc zadziała z każdym dostawcą.

| Wariant | `DATABASE_URL` | `DIRECT_URL` |
| --- | --- | --- |
| Prisma Postgres | `postgres://…@pooled.db.prisma.io:5432/postgres?sslmode=verify-full` | puste |
| Supabase | pooler, port `6543`, `?pgbouncer=true` | połączenie bezpośrednie, port `5432` |
| Lokalnie bez Dockera | `npm run db:dev` i adres **TCP** z komunikatu | puste |

`DIRECT_URL` służy wyłącznie do migracji z CLI ([prisma.config.ts](prisma.config.ts)).

Zmiana schematu w [prisma/schema.prisma](prisma/schema.prisma):

```bash
npm run db:dev                              # w osobnym terminalu, lokalny Postgres
npm run db:migrate -- --name opis_zmiany    # wymaga SHADOW_DATABASE_URL z .env.example
npm run db:deploy                           # potem na bazie produkcyjnej
```

### Zmienne środowiskowe

Wzór jest w [.env.example](.env.example). Plik `.env` z prawdziwymi danymi jest w `.gitignore` i nie trafia do repozytorium.

| Zmienna | Opis |
| --- | --- |
| `DATABASE_URL` | Połączenie aplikacji z bazą |
| `DIRECT_URL` | Opcjonalne połączenie bezpośrednie dla migracji |
| `NEXT_PUBLIC_SITE_URL` | Pełny adres strony. Z niego powstają linki do miniaturek dla Facebooka i Discorda |
| `AUTH_SECRET` | Min. 32 znaki. Podpisuje bilety regulaminu i sesje kapitanów w pokoju wyboru map |
| `SEED_ADMIN_LOGIN`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` | Pierwsze konto administratora (`npm run db:seed`) |
| `RULES_MIN_SECONDS` | Minimalny czas lektury regulaminu w sekundach (domyślnie 60) |
| `VETO_TURN_SECONDS` | Czas na ruch przy wyborze map w sekundach (domyślnie 45, `0` = bez limitu) |
| `REGISTRATION_OPEN` | `false` natychmiast wstrzymuje zapisy |

### Wdrożenie na własnej domenie

**Vercel**

1. Zaimportuj repozytorium i ustaw zmienne z `.env.example`, w tym `NEXT_PUBLIC_SITE_URL` z docelową domeną.
2. Zostaw domyślne polecenie budowania. `npm run build` samo uruchamia `prisma generate`.
3. Przed pierwszym uruchomieniem wykonaj lokalnie `npm run db:deploy` i `npm run db:seed` z produkcyjnym `DATABASE_URL`.
4. W Settings → Domains dodaj domenę i ustaw rekordy DNS zgodnie z instrukcją.

**VPS lub hosting z Node.js 20.9+**

```bash
npm ci
npm run db:deploy
npm run build
npm start -- -p 3000
```

Przed aplikacją postaw reverse proxy (nginx albo Caddy) z HTTPS. Proxy musi przekazywać nagłówek `X-Forwarded-For`, bo z niego liczone są limity prób.

Po wdrożeniu sprawdź podgląd linku w [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) albo wklej link na Discordzie.

### Jak to działa od środka

**Zapisy i regulamin**
- Serwer pilnuje czasu lektury niezależnie od przeglądarki. Przy renderze strony wydaje podpisany bilet ze znacznikiem czasu i odrzuca zgłoszenia wysłane za wcześnie.
- Oczekujące i zatwierdzone zgłoszenia zajmują slot, a odrzucone go zwalniają.
- Ochrona przed spamem: pole-pułapka (honeypot), limit 5 zgłoszeń na godzinę z jednego adresu IP oraz blokada powtórzonych nicków i osób.

**Granica RODO w kodzie**
- Strony publiczne i API korzystają tylko z [src/lib/queries.ts](src/lib/queries.ts), gdzie zapytania jawnie wybierają nazwę drużyny, tag, nicki i klasy.
- Pełne dane pobiera wyłącznie [src/lib/admin-queries.ts](src/lib/admin-queries.ts), używany tylko w `/admin` za sprawdzeniem sesji.
- Eksport CSV (`/admin/eksport?gra=cs2`) używa średników i znacznika BOM, więc polski Excel czyta go poprawnie.

**Wybór map (veto)**
1. Organizator rozstawia ćwierćfinały i klika **Wydaj PIN-y** przy meczu.
2. Kapitanowie wpisują PIN-y w pokoju meczu. Zegar tury rusza, gdy obaj są w środku.
3. BO1: bany naprzemiennie, aż zostanie decider. BO3: ban, ban, pick, pick, ban, ban, decider.
4. Po upływie `VETO_TURN_SECONDS` system sam banuje lub wybiera losową mapę. Nie potrzeba do tego crona, bo przekroczenie czasu rozlicza każdy odczyt stanu.
5. Widzowie widzą pokój bez logowania, z odświeżaniem co 1,5 s.
6. „Nowe PIN-y” unieważniają stare sesje kapitanów, a „Reset veto” czyści ruchy.

Pula map to Active Duty według stanu na lipiec 2026: Ancient, Anubis, Cache, Dust II, Inferno, Mirage, Nuke. Zmienia się ją w [src/lib/veto/maps.ts](src/lib/veto/maps.ts).

**Panel `/admin`**
- Konta nauczycieli są w bazie. Hasła są hashowane algorytmem scrypt, a sesje trzymane w ciasteczku httpOnly przez 12 godzin.
- Limit prób logowania to 8 na 15 minut z jednego adresu IP.

**Wygląd i dźwięk**
- Interfejs w stylu Steam / CS 1.6 (VGUI) jest w [src/components/vgui](src/components/vgui) i [src/components/shell](src/components/shell). Wspólne elementy formularzy i list używają klas `ui-*` z [src/app/globals.css](src/app/globals.css).
- Efekty i muzyka są syntezowane w przeglądarce przez Web Audio ([src/audio/deck.ts](src/audio/deck.ts)). Projekt nie zawiera plików audio. Wybór SFX, muzyki i głośności zapisuje się w `localStorage`.

### Struktura projektu

```
prisma/                 schemat, migracje, seed
src/app/(site)/         strony publiczne: / (przekierowanie na /cs2), /cs2, /rodo, pokój veto
src/app/admin/          logowanie, pulpit, zgłoszenia, drabinka, konta, eksport CSV
src/app/api/            /api/slots (licznik na żywo), /api/veto/[id] (stan pokoju)
src/actions/            server actions: zapisy, veto, panel
src/lib/                baza, sesje, drabinka, veto, walidacja, granica RODO
src/components/         shell, module, skin, veto, vgui, admin, sound
src/content/            dane wydarzenia i regulamin
src/audio/              silnik Web Audio
src/assets/og/          font DejaVu Sans do generowania miniaturek
```

> [!NOTE]
> Enum `Game` w bazie nadal zawiera wartości `VALORANT` i `LOL` z czasów, gdy turniej miał obejmować trzy gry. Zostały, żeby nie trzeba było migrować bazy. Aplikacja ich nie używa.

## Licencja

Kod jest udostępniony wyłącznie do wglądu. Wszelkie prawa zastrzeżone: bez pisemnej zgody autora nie wolno go kopiować, modyfikować, rozpowszechniać ani uruchamiać. Szczegóły są w pliku [LICENSE](LICENSE).

## Znaki towarowe

Counter-Strike 2 jest znakiem towarowym Valve Corporation. Turniej jest wydarzeniem szkolnym i nie jest powiązany z Valve.

Font DejaVu Sans, używany w miniaturkach do udostępniania, jest dostępny na licencji Bitstream Vera / DejaVu ([src/assets/og/LICENSE-DejaVu.txt](src/assets/og/LICENSE-DejaVu.txt)).
