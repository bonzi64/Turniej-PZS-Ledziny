import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Zapisy na Turniej PZS Lędziny 2026 – Counter-Strike 2";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
