-- CreateEnum
CREATE TYPE "Game" AS ENUM ('CS2', 'VALORANT', 'LOL');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'ORGANIZER');

-- CreateEnum
CREATE TYPE "MatchFormat" AS ENUM ('BO1', 'BO3');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "VetoAction" AS ENUM ('BAN', 'PICK', 'DECIDER');

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'ORGANIZER',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "game" "Game" NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "status" "TeamStatus" NOT NULL DEFAULT 'PENDING',
    "captainEmail" TEXT NOT NULL,
    "captainDiscord" TEXT,
    "reviewNote" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rulesSeconds" INTEGER NOT NULL,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "anonymizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "schoolClass" TEXT NOT NULL,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isReserve" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "game" "Game" NOT NULL,
    "round" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "teamAId" TEXT,
    "teamBId" TEXT,
    "scoreA" INTEGER,
    "scoreB" INTEGER,
    "winnerSide" "Side",
    "format" "MatchFormat" NOT NULL DEFAULT 'BO1',
    "startsAt" TIMESTAMP(3),
    "pinA" TEXT,
    "pinB" TEXT,
    "readyA" TIMESTAMP(3),
    "readyB" TIMESTAMP(3),
    "turnStartedAt" TIMESTAMP(3),
    "vetoDoneAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetoStep" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "map" TEXT NOT NULL,
    "action" "VetoAction" NOT NULL,
    "side" "Side",
    "auto" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VetoStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "hits" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_login_key" ON "Staff"("login");

-- CreateIndex
CREATE INDEX "Session_staffId_idx" ON "Session"("staffId");

-- CreateIndex
CREATE INDEX "Team_game_status_idx" ON "Team"("game", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Team_game_name_key" ON "Team"("game", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamId_slot_key" ON "Player"("teamId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "Match_game_round_slot_key" ON "Match"("game", "round", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "VetoStep_matchId_order_key" ON "VetoStep"("matchId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "VetoStep_matchId_map_key" ON "VetoStep"("matchId", "map");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetoStep" ADD CONSTRAINT "VetoStep_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
