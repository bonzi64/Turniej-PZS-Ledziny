import Link from "next/link";
import { Backdrop } from "@/components/shell/Backdrop";
import { Dialog } from "@/components/skin/parts";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <Backdrop />
      <Dialog
        title="Nie znaleziono strony"
        actions={
          <Link href="/" data-tone="gold" className="ui-btn min-w-44">
            Wróć do turnieju
          </Link>
        }
      >
        <p>Ten adres nie istnieje albo link jest nieaktualny.</p>
        <p className="mt-2 text-[13px] text-ui-faint">Turniej CS2 został odwołany – strona prowadzi teraz turniej League of Legends.</p>
      </Dialog>
    </div>
  );
}
