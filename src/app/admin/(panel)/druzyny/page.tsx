import Link from "next/link";
import { approveTeam, deleteTeam, rejectTeam, reopenTeam } from "@/actions/admin-teams";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { dateTime, GameTabs, pickGame, StatusBadge } from "@/components/admin/bits";
import { Identicon } from "@/components/vgui/pixel";
import { Group, Tag, Window } from "@/components/vgui/Window";
import type { TeamStatus } from "@/generated/prisma/enums";
import { statusCounts, teamsForReview } from "@/lib/admin-queries";
import { requireStaff } from "@/lib/auth/session";
import { GAMES } from "@/lib/games";

export const metadata = { title: "Zgłoszenia" };

const FILTERS: { value: TeamStatus | ""; label: string }[] = [
  { value: "", label: "Wszystkie" },
  { value: "PENDING", label: "Oczekujące" },
  { value: "APPROVED", label: "Zatwierdzone" },
  { value: "REJECTED", label: "Odrzucone" },
];

export default async function TeamsReview(props: PageProps<"/admin/druzyny">) {
  const staff = await requireStaff();
  const query = await props.searchParams;
  const game = pickGame(query.gra, GAMES);
  const status = FILTERS.find((f) => f.value && f.value === query.status)?.value || undefined;

  const [teams, counts] = await Promise.all([teamsForReview(game.code, status), statusCounts(game.code)]);
  const total = counts.PENDING + counts.APPROVED + counts.REJECTED;

  return (
    <div>
      <GameTabs base="/admin/druzyny" active={game} games={GAMES} />
      <Window
        title={`Zgłoszenia – ${game.name}`}
        status={
          <>
            <span>Pełne dane osobowe – nie udostępniaj zrzutów ekranu.</span>
            <a href={`/admin/eksport?gra=${game.slug}`} className="text-vg-gold underline">
              Eksport CSV
            </a>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const count = f.value ? counts[f.value] : total;
            const active = (status ?? "") === f.value;
            return (
              <Link
                key={f.label}
                href={`/admin/druzyny?gra=${game.slug}${f.value ? `&status=${f.value}` : ""}`}
                aria-current={active ? "page" : undefined}
                data-sfx=""
                className="vg-btn"
              >
                {f.label} ({count})
              </Link>
            );
          })}
        </div>

        {teams.length === 0 && <p className="vg-deep px-3 py-4 text-vg-muted">Brak zgłoszeń w tym widoku.</p>}

        <div className="space-y-2">
          {teams.map((team) => (
            <details key={team.id} id={`t-${team.id}`} open={team.status === "PENDING"} className="group vg-panel">
              <summary className="flex cursor-default list-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 hover:bg-vg-window">
                <span className="text-vg-muted transition-transform group-open:rotate-90">▸</span>
                <Identicon seed={team.name} size={20} />
                <span className="font-bold text-vg-gold">{team.name}</span>
                {team.tag && <span className="text-vg-muted">[{team.tag}]</span>}
                <span className="text-[11px] text-vg-muted">{[...new Set(team.players.map((p) => p.schoolClass))].join(" / ")}</span>
                <span className="ml-auto text-[11px] text-vg-muted">{dateTime.format(team.createdAt)}</span>
                <StatusBadge status={team.status} />
              </summary>

              <div className="grid grid-cols-1 gap-4 border-t border-vg-ink p-3 xl:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="space-y-3">
                  <div className="vg-deep vg-scroll overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-[12px]">
                      <thead>
                        <tr className="bg-vg-panel text-vg-muted">
                          <th className="px-2 py-1 font-normal">#</th>
                          <th className="px-2 py-1 font-normal">Nick</th>
                          <th className="px-2 py-1 font-normal">Imię</th>
                          <th className="px-2 py-1 font-normal">Nazwisko</th>
                          <th className="px-2 py-1 font-normal">Klasa</th>
                          <th className="px-2 py-1 font-normal">Rola</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.players.map((p) => (
                          <tr key={p.id} className="vg-row border-b border-vg-ink/70 last:border-b-0">
                            <td className="px-2 py-1 text-vg-muted">{p.isReserve ? "R" : p.slot + 1}</td>
                            <td className="px-2 py-1">{p.nickname}</td>
                            <td className="px-2 py-1">{p.firstName}</td>
                            <td className="px-2 py-1">{p.lastName}</td>
                            <td className="px-2 py-1">{p.schoolClass}</td>
                            <td className="px-2 py-1">
                              {p.isCaptain ? <Tag tone="orange">Kapitan</Tag> : p.isReserve ? <Tag tone="dark">Rezerwa</Tag> : <Tag tone="gold">Gracz</Tag>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
                    <div>
                      <dt className="text-vg-muted">E-mail kapitana</dt>
                      <dd>
                        <a href={`mailto:${team.captainEmail}`} className="text-vg-gold underline">
                          {team.captainEmail}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-vg-muted">Discord</dt>
                      <dd>{team.captainDiscord ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-vg-muted">Regulamin / zgoda</dt>
                      <dd>
                        {team.rulesSeconds < 600 ? `${team.rulesSeconds} s` : `${Math.round(team.rulesSeconds / 60)} min`} od otwarcia · zgoda{" "}
                        {dateTime.format(team.consentAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-vg-muted">Weryfikacja</dt>
                      <dd>{team.reviewedBy ? `${team.reviewedBy}, ${team.reviewedAt ? dateTime.format(team.reviewedAt) : ""}` : "—"}</dd>
                    </div>
                    {team.reviewNote && (
                      <div className="sm:col-span-2">
                        <dt className="text-vg-muted">Notatka</dt>
                        <dd className="text-[#ff9f8a]">{team.reviewNote}</dd>
                      </div>
                    )}
                    {team.anonymizedAt && <div className="text-[#ff9f8a] sm:col-span-2">Zanonimizowano {dateTime.format(team.anonymizedAt)}</div>}
                  </dl>
                </div>

                <Group legend="Decyzja" className="self-start">
                  <div className="space-y-2">
                    {team.status !== "APPROVED" && (
                      <ActionForm action={approveTeam} className="flex flex-col gap-1">
                        <input type="hidden" name="teamId" value={team.id} />
                        <Submit tone="gold" className="w-full">
                          ✓ Zatwierdź
                        </Submit>
                      </ActionForm>
                    )}
                    {team.status !== "REJECTED" && (
                      <ActionForm action={rejectTeam} className="flex flex-col gap-1">
                        <input type="hidden" name="teamId" value={team.id} />
                        <input name="note" className="vg-field" placeholder="Powód (opcjonalnie)" maxLength={300} />
                        <Submit confirm="Potwierdź odrzucenie" className="w-full">
                          ✕ Odrzuć
                        </Submit>
                      </ActionForm>
                    )}
                    {team.status !== "PENDING" && (
                      <ActionForm action={reopenTeam} className="flex flex-col gap-1">
                        <input type="hidden" name="teamId" value={team.id} />
                        <Submit className="w-full">Cofnij do weryfikacji</Submit>
                      </ActionForm>
                    )}
                    {staff.role === "ADMIN" && (
                      <ActionForm action={deleteTeam} className="flex flex-col gap-1 border-t border-vg-ink pt-2">
                        <input type="hidden" name="teamId" value={team.id} />
                        <Submit tone="danger" confirm="Usunąć na zawsze?" className="w-full">
                          Usuń zgłoszenie
                        </Submit>
                      </ActionForm>
                    )}
                  </div>
                </Group>
              </div>
            </details>
          ))}
        </div>
      </Window>
    </div>
  );
}
