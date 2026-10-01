import Image from "next/image";

const RATIO = 419 / 512;

export function SchoolLogo({ height, className = "", priority = false }: { height: number; className?: string; priority?: boolean }) {
  const src = height <= 64 ? "/brand/pzs-logo-128.png" : "/brand/pzs-logo.png";
  return (
    <Image
      src={src}
      alt="Logo Powiatowego Zespołu Szkół w Lędzinach"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
