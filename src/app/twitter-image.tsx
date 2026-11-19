import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Zapisy na Turniej PZS Lędziny 2026 – League of Legends";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard();
}
