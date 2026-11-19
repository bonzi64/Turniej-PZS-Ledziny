// Tło klienta: granat schodzący w czerń i drobne ziarno, które zdejmuje z gradientu „cyfrową” gładkość
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.8 0 0 0 0 0.78 0 0 0 0 0.72 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1a2e_0%,#06111f_35%,#010a13_75%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgb(0_0_0/0.5)_100%)]" />
    </div>
  );
}
