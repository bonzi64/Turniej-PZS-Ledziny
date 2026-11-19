import type { ReactNode } from "react";

// Ikony rysowane jedną kreską 1.6 px na siatce 20×20 – jeden zestaw dla całej strony

type IconProps = { size?: number; className?: string };

function Svg({ size = 16, className = "", children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function SpeakerIcon({ muted, ...props }: IconProps & { muted: boolean }) {
  return (
    <Svg {...props}>
      <path d="M3.5 8 H6.5 L10.5 4.5 V15.5 L6.5 12 H3.5 Z" fill="currentColor" stroke="none" />
      {muted ? <path d="M13.5 8 L17.5 12 M17.5 8 L13.5 12" /> : <path d="M13.5 7.5 Q15.2 10 13.5 12.5 M15.6 5.6 Q18.8 10 15.6 14.4" />}
    </Svg>
  );
}

export function NoteIcon({ muted, ...props }: IconProps & { muted: boolean }) {
  return (
    <Svg {...props}>
      <path d="M8 14.5 V4.5 L16 3 V12.5" />
      <ellipse cx="5.8" cy="14.6" rx="2.4" ry="1.9" fill="currentColor" stroke="none" />
      <ellipse cx="13.8" cy="12.7" rx="2.4" ry="1.9" fill="currentColor" stroke="none" />
      {muted && <path d="M2.5 2.5 L17.5 17.5" />}
    </Svg>
  );
}

export function ExpandIcon({ active, ...props }: IconProps & { active: boolean }) {
  return (
    <Svg {...props}>
      {active ? <path d="M7.5 3 V7.5 H3 M12.5 3 V7.5 H17 M7.5 17 V12.5 H3 M12.5 17 V12.5 H17" /> : <path d="M3 7.5 V3 H7.5 M17 7.5 V3 H12.5 M3 12.5 V17 H7.5 M17 12.5 V17 H12.5" />}
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 10.5 L8 15 L16.5 5" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5 L15 15 M15 5 L5 15" />
    </Svg>
  );
}

export function ChevronIcon({ dir = "right", ...props }: IconProps & { dir?: "left" | "right" | "down" }) {
  const d = dir === "left" ? "M12.5 4.5 L7 10 L12.5 15.5" : dir === "down" ? "M4.5 7.5 L10 13 L15.5 7.5" : "M7.5 4.5 L13 10 L7.5 15.5";
  return (
    <Svg {...props}>
      <path d={d} />
    </Svg>
  );
}

export function ArrowOutIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 4 H16 V12 M16 4 L5 15" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 5.5 H17 M3 10 H17 M3 14.5 H17" />
    </Svg>
  );
}

export function LockIcon({ open = false, ...props }: IconProps & { open?: boolean }) {
  return (
    <Svg {...props}>
      <rect x="4" y="9" width="12" height="8.5" />
      <path d={open ? "M7 9 V6.5 A3 3 0 0 1 12.8 5.4" : "M7 9 V6.5 A3 3 0 0 1 13 6.5 V9"} />
    </Svg>
  );
}

export function CrownIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 16" width={size} height={(size * 16) / 24} className={`shrink-0 ${className}`} aria-hidden>
      <path d="M2 14 L1 3 L7 8 L12 1 L17 8 L23 3 L22 14 Z" fill="#c8aa6e" stroke="#010a13" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 6.5 H6 L7.5 4 H12.5 L14 6.5 H17.5 V16 H2.5 Z" />
      <circle cx="10" cy="11" r="3" />
    </Svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 3 V13 M5.5 8.5 L10 13 L14.5 8.5 M3.5 17 H16.5" />
    </Svg>
  );
}

// Minimapa Summoner's Rift: bazy w narożnikach, trzy linie, rzeka w poprzek
export function RiftMap({ size = 56, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <rect x="2" y="2" width="96" height="96" rx="6" fill="#0a1428" stroke="#785a28" strokeWidth="2" />
      <path d="M12 12 L88 88" stroke="#0397ab" strokeOpacity="0.3" strokeWidth="11" strokeLinecap="round" />
      <g fill="none" stroke="#c8aa6e" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 84 L16 16 L84 16" />
        <path d="M16 84 L84 84 L84 16" />
        <path d="M16 84 L84 16" />
      </g>
      <circle cx="16" cy="84" r="7" fill="#0ac8b9" stroke="#010a13" strokeWidth="2" />
      <circle cx="84" cy="16" r="7" fill="#e84057" stroke="#010a13" strokeWidth="2" />
    </svg>
  );
}
