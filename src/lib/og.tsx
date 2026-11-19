/* eslint-disable @next/next/no-img-element -- Satori (next/og) obsługuje tylko zwykły <img> */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { EVENT } from "@/content/event";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

// rdzeń hextech z HextechCore, spłaszczony do jednego pliku SVG
function coreSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" width="400" height="400">
<defs>
<linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0e6d2"/><stop offset=".45" stop-color="#c8aa6e"/><stop offset="1" stop-color="#785a28"/></linearGradient>
<linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdfafa"/><stop offset="1" stop-color="#0397ab"/></linearGradient>
<linearGradient id="b" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0ac8b9"/><stop offset="1" stop-color="#005a82"/></linearGradient>
</defs>
<circle r="86" fill="none" stroke="url(#m)" stroke-width="5"/>
<circle r="78" fill="none" stroke="#463714" stroke-width="1.2"/>
<path d="M0 -96 L10 -84 L0 -76 L-10 -84 Z M0 96 L10 84 L0 76 L-10 84 Z M-96 0 L-84 10 L-76 0 L-84 -10 Z M96 0 L84 10 L76 0 L84 -10 Z" fill="#010a13" stroke="url(#m)" stroke-width="2"/>
<path d="M-52 -40 A66 66 0 0 1 -14 -64 M52 -40 A66 66 0 0 0 14 -64 M-52 44 A66 66 0 0 0 -14 66 M52 44 A66 66 0 0 1 14 66" fill="none" stroke="url(#m)" stroke-width="3" stroke-linecap="round"/>
<g transform="rotate(-8)">
<polygon points="0,-62 22,-30 0,-14 -22,-30" fill="url(#a)"/>
<polygon points="22,-30 0,-14 0,10 26,-6" fill="url(#b)"/>
<polygon points="-22,-30 0,-14 0,10 -26,-6" fill="#0a323c"/>
<polygon points="0,10 26,-6 14,40 0,52" fill="#005a82"/>
<polygon points="0,10 -26,-6 -14,40 0,52" fill="#062a33"/>
<polyline points="0,-62 22,-30 26,-6 14,40 0,52 -14,40 -26,-6 -22,-30 0,-62" fill="none" stroke="#cdfafa" stroke-opacity=".7" stroke-width=".8"/>
</g>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function renderOgCard() {
  const [marcellus, barlow] = await Promise.all([font("marcellus-sc-400.ttf"), font("barlow-semi-condensed-600.ttf")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "Barlow",
          color: "#f0e6d2",
          background: "linear-gradient(180deg, #10233a 0%, #0a1626 40%, #030b15 100%)",
        }}
      >
        <div style={{ position: "absolute", left: 24, top: 24, right: 24, bottom: 24, display: "flex", border: "4px solid #c8aa6e" }} />
        <div style={{ position: "absolute", left: 30, top: 30, right: 30, bottom: 30, display: "flex", border: "1px solid rgba(120,90,40,0.6)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 60, padding: "0 90px", width: "100%" }}>
          <img src={coreSvg()} width={380} height={380} alt="" style={{ flexShrink: 0 }} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, color: "#c8aa6e" }}>{`LEAGUE OF LEGENDS · ${EVENT.dateLabel}`}</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 14, fontFamily: "Marcellus SC", fontSize: 88, lineHeight: 1, color: "#f0e6d2" }}>
              <span style={{ display: "flex" }}>Turniej</span>
              <span style={{ display: "flex", marginTop: 4 }}>PZS Lędziny</span>
            </div>
            <div style={{ display: "flex", width: 420, height: 1, marginTop: 28, background: "linear-gradient(90deg, #785a28, rgba(70,55,20,0))" }} />
            <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
              {["5 na 5", "Tournament Draft", "BO1", "8 drużyn"].map((label) => (
                <div key={label} style={{ display: "flex", padding: "6px 14px", fontSize: 22, color: "#cdbe91", border: "2px solid #463714", background: "rgba(1,10,19,0.7)" }}>
                  {label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 30, fontSize: 24, color: "#a09b8c" }}>{`Zapisy do ${EVENT.registrationClosesLabel} · ${EVENT.schoolShort}`}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Barlow", data: barlow, weight: 600 },
        { name: "Marcellus SC", data: marcellus, weight: 400 },
      ],
    },
  );
}
