import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const holder = globalThis as unknown as { pzsDb?: PrismaClient };

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Brak DATABASE_URL – skopiuj .env.example do .env");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const db = holder.pzsDb ?? connect();

// hot reload w dev nie może mnożyć puli połączeń
if (process.env.NODE_ENV !== "production") holder.pzsDb = db;
