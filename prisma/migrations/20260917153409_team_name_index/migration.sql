-- DropIndex
DROP INDEX "Team_game_name_key";

-- CreateIndex
CREATE INDEX "Team_game_name_idx" ON "Team"("game", "name");
