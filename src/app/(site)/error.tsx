"use client";

import { Emblem } from "@/components/vgui/pixel";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="vg-window w-full max-w-sm" role="alertdialog" aria-labelledby="err-title">
        <div className="vg-titlebar">
          <Emblem className="text-vg-orange" />
          <span id="err-title">Utracono połączenie z serwerem</span>
        </div>
        <div className="px-4 pb-4">
          <p>Nie udało się pobrać danych turnieju.</p>
          <p className="mt-2 text-[12px] text-vg-muted">Sprawdź połączenie i spróbuj ponownie za chwilę.</p>
          <div className="mt-4 flex justify-end">
            <button type="button" data-sfx="" data-default="" onClick={reset} className="vg-btn min-w-28">
              Połącz ponownie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
