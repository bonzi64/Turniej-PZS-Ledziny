"use client";

import { Dialog } from "@/components/skin/parts";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-2">
      <Dialog
        title="Utracono połączenie"
        tone="error"
        actions={
          <button type="button" data-sfx="" data-tone="gold" onClick={reset} className="ui-btn min-w-44">
            Połącz ponownie
          </button>
        }
      >
        <p>Nie udało się pobrać danych turnieju. Sprawdź połączenie i spróbuj ponownie za chwilę.</p>
      </Dialog>
    </div>
  );
}
