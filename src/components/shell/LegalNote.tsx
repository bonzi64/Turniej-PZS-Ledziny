import Link from "next/link";
import { EVENT } from "@/content/event";

export function LegalNote() {
  return (
    <div className="text-[11px] leading-relaxed text-ui-faint">
      <p>
        {EVENT.school}, {EVENT.address} ·{" "}
        <Link href="/rodo" className="underline hover:text-ui-accent">
          Dane osobowe
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="underline hover:text-ui-accent">
          Panel organizatora
        </Link>
      </p>
      <p className="mt-1">
        Counter-Strike 2 jest znakiem towarowym Valve Corporation. Turniej szkolny, niepowiązany z tą firmą.
      </p>
    </div>
  );
}
