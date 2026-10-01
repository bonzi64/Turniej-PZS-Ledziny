import Link from "next/link";
import { Emblem } from "@/components/vgui/pixel";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[radial-gradient(110%_80%_at_70%_35%,#1a2f52,#050b14_60%,#010205)] px-4">
      <div className="vg-window w-full max-w-sm" role="alertdialog" aria-labelledby="nf-title">
        <div className="vg-titlebar">
          <Emblem className="text-vg-gold" />
          <span id="nf-title">Błąd połączenia</span>
        </div>
        <div className="px-4 pb-4">
          <p>Nie można połączyć się z tym adresem.</p>
          <p className="mt-2 text-[12px] text-vg-muted">Serwer zwrócił 404 – link jest nieaktualny albo moduł jest wyłączony.</p>
          <div className="mt-4 flex justify-end">
            <Link href="/" data-default="" className="vg-btn min-w-20">
              OK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
