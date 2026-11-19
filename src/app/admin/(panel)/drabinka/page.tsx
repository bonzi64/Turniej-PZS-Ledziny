import { prepareBracket, randomizeSeeds, saveResult, saveSchedule, seatTeam, wipeResult } from "@/actions/admin-bracket";
import { ActionForm, Submit } from "@/components/admin/ActionForm";
import { GameTabs, pickGame } from "@/components/admin/bits";
import { Group, Tag, Window } from "@/components/hx/frame";
import type { Match } from "@/generated/prisma/client";
import type { Side } from "@/generated/prisma/enums";
import { bracketBoard } from "@/lib/admin-queries";
import { requireStaff } from "@/lib/auth/session";
import { GAMES } from "@/lib/games";
import { matchLabel, ROUNDS } from "@/lib/tournament";

export const metadata = { title: "Drabinka" };

// datetime-local oczekuje czasu lokalnego bez strefy
function localInput(date: Date | null) {
  if (!date) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Warsaw",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

type Board = Awaited<ReturnType<typeof bracketBoard>>;
type BoardMatch = Board["matches"][number];

function SeatPicker({ match, side, board }: { match: Match; side: Side; board: Board }) {
  const current = side === "A" ? match.teamAId : match.teamBId;
  return (
    <ActionForm action={seatTeam} className="flex flex-wrap items-center gap-1.5" quiet>
      <input type="hidden" name="matchId" value={match.id} />
      <input type="hidden" name="side" value={side} />
      <span className="w-3 font-bold text-ui-muted">{side}</span>
      <select name="teamId" defaultValue={current ?? ""} className="ui-field min-w-0 flex-1" aria-label={`Drużyna ${side}`}>
        <option value="">— wolne —</option>
        {board.approved.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
            {board.seated.has(t.id) && t.id !== current ? " (rozstawiona)" : ""}
          </option>
        ))}
      </select>
      <Submit>Ustaw</Submit>
    </ActionForm>
  );
}

function MatchPanel({ match, board }: { match: BoardMatch; board: Board }) {
  const nameOf = (id: string | null) => (id ? (board.names.get(id)?.name ?? "?") : "TBD");

  return (
    <Group legend={`${matchLabel(match.round, match.slot)} · ${match.format}`}>
      <div className="space-y-2.5 text-[13px]">
        {match.round === 1 ? (
          <div className="space-y-1.5">
            <SeatPicker match={match} side="A" board={board} />
            <SeatPicker match={match} side="B" board={board} />
          </div>
        ) : (
          <p className="ui-inset px-3 py-2 font-bold">
            {nameOf(match.teamAId)} <span className="font-normal text-ui-muted">vs</span> {nameOf(match.teamBId)}
          </p>
        )}

        <ActionForm action={saveResult} className="flex flex-wrap items-center gap-1.5">
          <input type="hidden" name="matchId" value={match.id} />
          <span className="w-12 text-ui-muted">Wynik</span>
          <input name="scoreA" type="number" min={0} max={99} defaultValue={match.scoreA ?? ""} className="ui-field w-14 text-center" aria-label="Wynik A" />
          <span>:</span>
          <input name="scoreB" type="number" min={0} max={99} defaultValue={match.scoreB ?? ""} className="ui-field w-14 text-center" aria-label="Wynik B" />
          <Submit tone="gold">Zapisz</Submit>
          {match.winnerSide && <Tag tone="green">rozegrany</Tag>}
        </ActionForm>

        {match.winnerSide && (
          <ActionForm action={wipeResult} className="flex flex-wrap gap-1.5">
            <input type="hidden" name="matchId" value={match.id} />
            <Submit tone="danger" confirm="Wyczyścić?">
              Wyczyść wynik
            </Submit>
          </ActionForm>
        )}

        <ActionForm action={saveSchedule} className="flex flex-wrap items-center gap-1.5">
          <input type="hidden" name="matchId" value={match.id} />
          <span className="w-12 text-ui-muted">Godzina</span>
          <input name="startsAt" type="datetime-local" defaultValue={localInput(match.startsAt)} className="ui-field min-w-0 flex-1" aria-label="Godzina meczu" />
          <Submit>Zapisz</Submit>
        </ActionForm>
      </div>
    </Group>
  );
}

export default async function BracketAdmin(props: PageProps<"/admin/drabinka">) {
  await requireStaff();
  const game = pickGame((await props.searchParams).gra, GAMES);
  const board = await bracketBoard(game.code);
  const unseated = board.approved.filter((t) => !board.seated.has(t.id));

  return (
    <div>
      <GameTabs base="/admin/drabinka" active={game} games={GAMES} />
      <Window title={`Drabinka – ${game.name}`} status={<span>Zatwierdzone: {board.approved.length} · poza drabinką: {unseated.length}</span>}>
        {board.matches.length === 0 ? (
          <div className="ui-inset px-3 py-4">
            <p className="text-ui-muted">Drabinka dla {game.name} nie została jeszcze utworzona.</p>
            <ActionForm action={prepareBracket} className="mt-3 flex flex-wrap gap-1.5">
              <input type="hidden" name="game" value={game.code} />
              <Submit tone="gold">Utwórz pustą drabinkę (8 drużyn)</Submit>
            </ActionForm>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <ul className="flex flex-wrap gap-1">
                {board.approved.map((t) => (
                  <li key={t.id}>
                    <Tag tone={board.seated.has(t.id) ? "dark" : "gold"}>{t.name}</Tag>
                  </li>
                ))}
              </ul>
              <ActionForm action={randomizeSeeds} className="flex flex-wrap gap-1.5">
                <input type="hidden" name="game" value={game.code} />
                <Submit tone="gold" confirm="Rozlosować od nowa?">
                  Losuj rozstawienie
                </Submit>
              </ActionForm>
            </div>

            {ROUNDS.map((meta) => (
              <section key={meta.round}>
                <h3 className="ui-col-head mb-4">{meta.label}</h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
                  {board.matches
                    .filter((m) => m.round === meta.round)
                    .map((match) => (
                      <MatchPanel key={match.id} match={match} board={board} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Window>
    </div>
  );
}
