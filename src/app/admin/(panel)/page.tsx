import Link from "next/link";
import { anonymizeGame } from "@/actions/admin-teams";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { dateTime } from "@/components/admin/bits";
import { PixelText } from "@/components/vgui/pixel";
import { Group, Window } from "@/components/vgui/Window";
import { EVENT } from "@/content/event";
import { overview } from "@/lib/admin-queries";
import { requireStaff } from "@/lib/auth/session";
import { GAMES, gameByCode } from "@/lib/games";
import { MAX_TEAMS } from "@/lib/tournament";

export const metadata = { title: "Pulpit" };

export default async function Dashboard() {
  const staff = await requireStaff();
  const { counts, recent: queue } = await overview();

  return (
    <>
      <Window title="Pulpit organizatora" status={<span>Turniej {EVENT.dateLabel} · zapisy do {EVENT.registrationClosesLabel}</span>}>
        <div className={`grid grid-cols-1 gap-4 ${counts.length > 1 ? "md:grid-cols-3" : ""}`}>
          {counts.map(({ game, pending, approved, rejected }) => (
            <Group key={game.slug} legend={game.name}>
              <div className="flex items-center justify-between gap-3">
                <div className="vg-deep px-3 py-2 text-vg-gold">
                  <PixelText text={`${String(pending + approved).padStart(2, "0")}/0${MAX_TEAMS}`} dot={4} ghost label={`${pending + approved} z ${MAX_TEAMS} slotów`} />
                </div>
                <Link href={`/admin/druzyny?gra=${game.slug}`} data-sfx="" className="vg-btn">
                  Zgłoszenia
                </Link>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px]">
                {[
                  ["Oczekuje", pending, "text-vg-gold"],
                  ["Zatwierdz.", approved, "text-vg-green"],
                  ["Odrzucone", rejected, "text-[#ff9f8a]"],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="vg-deep py-1.5">
                    <dd className={`text-[18px] font-bold tabular ${tone}`}>{value}</dd>
                    <dt className="text-vg-muted">{label}</dt>
                  </div>
                ))}
              </dl>
            </Group>
          ))}
        </div>
      </Window>

      <Window title="Do weryfikacji">
        {queue.length === 0 ? (
          <p className="text-vg-muted">Brak oczekujących zgłoszeń.</p>
        ) : (
          <div className="vg-deep vg-scroll overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-vg-panel text-vg-muted">
                  <th className="px-2 py-1 font-normal">Gra</th>
                  <th className="px-2 py-1 font-normal">Drużyna</th>
                  <th className="px-2 py-1 font-normal">Kapitan</th>
                  <th className="px-2 py-1 font-normal">Skład</th>
                  <th className="px-2 py-1 font-normal">Zgłoszono</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {queue.map((team) => {
                  const game = gameByCode(team.game);
                  return (
                    <tr key={team.id} className="vg-row border-b border-vg-ink/70 last:border-b-0">
                      <td className="px-2 py-1.5">{game.short}</td>
                      <td className="px-2 py-1.5 font-bold">
                        {team.name} {team.tag && <span className="font-normal text-vg-muted">[{team.tag}]</span>}
                      </td>
                      <td className="px-2 py-1.5">{team.captainEmail}</td>
                      <td className="px-2 py-1.5">{team._count.players} os.</td>
                      <td className="px-2 py-1.5 text-vg-muted">{dateTime.format(team.createdAt)}</td>
                      <td className="px-2 py-1.5 text-right">
                        <Link href={`/admin/druzyny?gra=${game.slug}&status=PENDING#t-${team.id}`} className="vg-btn">
                          Sprawdź
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Window>

      {staff.role === "ADMIN" && (
        <Window title="RODO – anonimizacja po turnieju">
          <p className="max-w-2xl text-[12px] text-vg-muted">
            Zastępuje imiona, nazwiska, e-maile i Discordy wybranej gry. Nicki, klasy, nazwy drużyn i wyniki zostają. Operacji nie da się
            cofnąć – wykonaj ją po {EVENT.dataRetention} albo na wniosek uczestników.
          </p>
          <ActionForm action={anonymizeGame} className="mt-3 flex flex-wrap items-end gap-2">
            <div>
              <label className="vg-label" htmlFor="anon-game">
                Gra
              </label>
              <select id="anon-game" name="game" className="vg-field w-48">
                {GAMES.map((g) => (
                  <option key={g.slug} value={g.code}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="vg-label" htmlFor="anon-confirm">
                Wpisz ANONIMIZUJ
              </label>
              <input id="anon-confirm" name="confirm" className="vg-field w-48" autoComplete="off" />
            </div>
            <Submit tone="danger" confirm="Na pewno?" className="min-h-[26px]">
              Anonimizuj dane
            </Submit>
          </ActionForm>
        </Window>
      )}
    </>
  );
}
