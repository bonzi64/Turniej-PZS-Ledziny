import Link from "next/link";
import { anonymizeGame } from "@/actions/admin-teams";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { dateTime } from "@/components/admin/bits";
import { Group, Window } from "@/components/hx/frame";
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
                <p className="hx-digits text-[44px]" aria-label={`${pending + approved} z ${MAX_TEAMS} miejsc`}>
                  {pending + approved}
                  <span className="text-[24px] text-ui-muted">/{MAX_TEAMS}</span>
                </p>
                <Link href={`/admin/druzyny?gra=${game.slug}`} data-sfx="" data-tone="gold" className="ui-btn">
                  Zgłoszenia
                </Link>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
                {[
                  ["Oczekuje", pending, "text-gold"],
                  ["Zatwierdzone", approved, "text-ui-ok"],
                  ["Odrzucone", rejected, "text-ui-danger"],
                ].map(([label, value, tone]) => (
                  <div key={label as string} className="ui-inset py-2.5">
                    <dd className={`hx-digits text-[22px] ${tone}`}>{value}</dd>
                    <dt className="mt-1 tracking-[0.08em] text-ui-muted uppercase">{label}</dt>
                  </div>
                ))}
              </dl>
            </Group>
          ))}
        </div>
      </Window>

      <Window title="Do weryfikacji">
        {queue.length === 0 ? (
          <p className="text-ui-muted">Brak oczekujących zgłoszeń.</p>
        ) : (
          <div className="ui-inset ui-scroll overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="ui-subhead">
                  <th className="px-2 py-1 font-bold">Gra</th>
                  <th className="px-2 py-1 font-bold">Drużyna</th>
                  <th className="px-2 py-1 font-bold">Kapitan</th>
                  <th className="px-2 py-1 font-bold">Skład</th>
                  <th className="px-2 py-1 font-bold">Zgłoszono</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {queue.map((team) => {
                  const game = gameByCode(team.game);
                  return (
                    <tr key={team.id} className="ui-row border-b border-hull last:border-b-0">
                      <td className="px-2 py-1.5">{game.short}</td>
                      <td className="px-2 py-1.5 font-bold">
                        {team.name} {team.tag && <span className="font-normal text-ui-muted">[{team.tag}]</span>}
                      </td>
                      <td className="px-2 py-1.5">{team.captainEmail}</td>
                      <td className="px-2 py-1.5">{team._count.players} os.</td>
                      <td className="px-2 py-1.5 text-ui-muted">{dateTime.format(team.createdAt)}</td>
                      <td className="px-2 py-1.5 text-right">
                        <Link href={`/admin/druzyny?gra=${game.slug}&status=PENDING#t-${team.id}`} className="ui-btn">
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
          <p className="max-w-2xl text-[13px] text-ui-muted">
            Zastępuje imiona, nazwiska, e-maile i Discordy wybranej gry. Nicki, klasy, nazwy drużyn i wyniki zostają. Operacji nie da się
            cofnąć – wykonaj ją po {EVENT.dataRetention} albo na wniosek uczestników.
          </p>
          <ActionForm action={anonymizeGame} className="mt-3 flex flex-wrap items-end gap-2">
            <div>
              <label className="ui-label" htmlFor="anon-game">
                Gra
              </label>
              <select id="anon-game" name="game" className="ui-field w-48">
                {GAMES.map((g) => (
                  <option key={g.slug} value={g.code}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="ui-label" htmlFor="anon-confirm">
                Wpisz ANONIMIZUJ
              </label>
              <input id="anon-confirm" name="confirm" className="ui-field w-48" autoComplete="off" />
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
