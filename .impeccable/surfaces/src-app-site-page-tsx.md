---
version: 1
slug: "src-app-site-page-tsx"
primary_target: "src/app/(site)/page.tsx"
related_targets: ["src/app/(site)/layout.tsx"]
---

# Surface: strona główna turnieju LoL (`/`, zakładka Home) i cała powłoka strony

Mode: Persuade (zakładka Home). Zakładki Regulamin, Zapisy, Drużyny, Drabinka oraz `/zdjecia`, `/rodo` i `/admin` to Operate w tej samej powłoce.

Audience and job: uczeń-kapitan na telefonie albo szkolnym PC ma w kilka sekund zrozumieć, że to szkolny turniej LoL 04.12.2026, i zgłosić piątkę z rezerwowym. W dniu turnieju widzowie patrzą na drabinkę (rzutnik).

Constraints: brak limitu wieku i zgód; wszystkie mecze BO1; dane publiczne tylko nicki, nazwa, tag, klasa; brak grafik Riot (żadnych splash artów, logotypów Riot); fonty z Google Fonts hostowane lokalnie w public/fonts (next/font/google psuje się w tej wersji Turbopacka).

Unresolved: nagrody, sala, IOD (pola w `src/content/event.ts`).

## Direction contract

THESIS: Turniej jest wydarzeniem na ekranie Home klienta LoL: przycisk PLAY to „Zapisz drużynę”, wyróżniony baner to turniej, a lista znajomych to 8 slotów drużyn. Odrzuca typowy esportowy landing (nagłówek, trzy karty funkcji, licznik) i okno Steama z wersji CS.

OWN-WORLD: Grunt void #010a13 i granat #0b1a2e z drobnym ziarnem (bez rozmytych poświat), metalowe ramki: rant gradientem #f0e6d2 → #c8aa6e → #785a28 → #c89b3c → #463714 (baner, kafle, okna 3 px; panele 2 px), cienkie brązowe rozdzielacze bez rombów, turkus hextech #0ac8b9 tylko dla stanu aktywnego i „na żywo”, tekst pergamin #f0e6d2, przygaszony #a09b8c. Typografia (wybór użytkownika z 19.11.2026, druga runda): Big Shoulders Display 700–900 w wersalikach – esportowy krój jak w grafikach transmisji LEC/Worlds – do nagłówków, menu i przycisków; Barlow Semi Condensed do tekstu, etykiet i liczb (cyfry tabelaryczne). Ruch: krążąca energia na rancie PLAY, iskry nad rdzeniem, przesuwane podkreślenie zakładek, kolejne wejścia elementów; kursor – fasetowana złota strzałka z turkusowym klejnotem. Grafika: rdzeń hextech – metalowy pierścień z czterema rombami, złote łuki-klamry i fasetowany turkusowy kryształ. Komponenty: ścięty przycisk PLAY z turkusowym wnętrzem i metalowym rantem, okrągły pierścień z herbem szkoły, zakładki ze złotym podkreśleniem, panel społeczności z kropkami statusu.

STORY: Uczeń widzi: szkolny turniej LoL, piątek 04.12, 8 drużyn, sloty i odliczanie na żywo. Wierzy, bo widzi prawdziwe daty, regulamin i licznik z bazy. Klika „Zapisz drużynę”, czyta regulamin, wysyła zgłoszenie; po zapisie widzi drużynę w panelu.

FIRST VIEWPORT: Belka 80 px: pierścień z logo szkoły nachodzi na ścięty przycisk „Zapisz drużynę” w lewym górnym rogu, obok zakładki Home, Regulamin, Drużyny, Drabinka, Zdjęcia, po prawej dźwięk i pełny ekran. Pod spodem kolumna główna: baner ok. 470 px wysokości, po lewej H1 „Turniej PZS Lędziny” ok. 104 px w Big Shoulders Display (bez „pucharu”, dopóki nagrody nie są potwierdzone), lead, trzy chipy (termin, odliczanie i drużyny x/8 z turkusowym znacznikiem na żywo), złoty CTA „Zapisz drużynę” i link do regulaminu; po prawej rdzeń hextech z unoszącym się kryształem (herb szkoły jest w pierścieniu przy przycisku PLAY). Pod banerem trzy kafle z prawdziwym stanem: Jak się zapisać (krok 1 pokazuje stan bramki regulaminu), Ćwierćfinały (pary z bazy), Zasady meczu; zamiast Regulamin/Drabinka/Zdjęcia ze szkicu, bo galeria istnieje dopiero po turnieju (zasada 4 w PRODUCT.md). Po prawej panel 300 px jak lista znajomych: szkoła ze statusem zapisów i zawsze 8 miejsc – drużyny ze składem, wiersze W weryfikacji, wolne sloty z przerywanym pierścieniem. Główna akcja: przycisk PLAY i CTA banera. Sygnatura: intro w stylu ładowania klienta, w którym rdzeń hextech składa się w takt ładowania i przelatuje na baner; hover PLAY rozjaśnia rant i przeciąga turkusowy połysk.

FORM: Struktura „Strona główna klienta” (zakładka Home klienta LoL), pozycja 6 z 7 na mojej uporządkowanej liście, rozdana przez rzut i wybrana przez użytkownika. seed:2d49759d4aaa3c2f

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
