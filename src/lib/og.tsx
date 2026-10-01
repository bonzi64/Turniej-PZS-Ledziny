/* eslint-disable @next/next/no-img-element -- Satori (next/og) obsługuje tylko zwykły <img> */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { pixelRows } from "@/components/vgui/pixel";
import { EVENT, TAGLINE } from "@/content/event";
import { GAMES, type GameModule } from "@/lib/games";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

const logo = async () => `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/pzs-logo.png"))).toString("base64")}`;
const LOGO_RATIO = 419 / 512;

const C = {
  window: "#4c5844",
  panel: "#3e4637",
  deep: "#2a2e22",
  ink: "#1c1f17",
  hi: "#889180",
  text: "#dedfd6",
  muted: "#a8b09c",
  gold: "#c4b550",
};

function Dots({ text, dot, color }: { text: string; dot: number; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {pixelRows(text).map((row, y) => (
        <div key={y} style={{ display: "flex", gap: 2 }}>
          {[...row].map((cell, x) => (
            <div key={x} style={{ width: dot, height: dot, background: cell === "#" ? color : "rgba(196,181,80,0.08)" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export async function renderOgCard(game?: GameModule) {
  const [shield, regular, bold] = await Promise.all([logo(), font("dejavu-sans-latin-400-normal.woff"), font("dejavu-sans-latin-700-normal.woff")]);
  const mark = game?.short ?? "PZS";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "DejaVu",
          color: C.text,
          background: "radial-gradient(110% 90% at 70% 35%, #1a2f52 0%, #050b14 60%, #010205 100%)",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 176, width: 900, height: 2, background: "linear-gradient(90deg, rgba(217,192,79,0) 0%, #d9c04f 20%, rgba(217,192,79,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 196, width: 700, height: 1, background: "linear-gradient(90deg, rgba(217,192,79,0) 0%, rgba(217,192,79,0.6) 25%, rgba(217,192,79,0) 100%)" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 1060,
            background: C.window,
            border: "2px solid #262b1f",
            boxShadow: "0 18px 50px rgba(0,0,0,0.75)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", fontSize: 26, fontWeight: 700 }}>
            <div style={{ width: 22, height: 22, background: C.gold, display: "flex" }} />
            <span style={{ display: "flex" }}>{TAGLINE}</span>
          </div>

          <div style={{ display: "flex", gap: 36, margin: "0 22px 22px", padding: 30, background: C.panel, border: `2px solid ${C.ink}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, padding: 20, background: C.deep, border: `2px solid ${C.ink}` }}>
              <img src={shield} width={Math.round(150 * LOGO_RATIO)} height={150} alt="" />
              <Dots text={mark} dot={game ? 11 : 13} color={C.gold} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: C.gold }}>{game ? game.name : "Turniej E-sportowy"}</div>
              <div style={{ display: "flex", fontSize: 32 }}>{`PZS Lędziny · ${EVENT.dateLabel}`}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {(game ? game.mode.slice(0, 3) : GAMES.map((g) => g.short)).map((label) => (
                  <div key={label} style={{ display: "flex", padding: "4px 12px", fontSize: 20, fontWeight: 700, background: C.gold, color: C.ink }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0 12px 12px",
              padding: "8px 14px",
              fontSize: 20,
              color: C.muted,
              background: C.panel,
              border: `2px solid ${C.ink}`,
            }}
          >
            <span style={{ display: "flex" }}>{EVENT.address}</span>
            <span style={{ display: "flex" }}>{`Zapisy do ${EVENT.registrationClosesLabel}`}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "DejaVu", data: regular, weight: 400 },
        { name: "DejaVu", data: bold, weight: 700 },
      ],
    },
  );
}
