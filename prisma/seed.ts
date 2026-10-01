import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword, PASSWORD_MIN } from "../src/lib/auth/password";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const login = process.env.SEED_ADMIN_LOGIN?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";
  const displayName = process.env.SEED_ADMIN_NAME?.trim() || "Administrator";

  if (!login || password.length < PASSWORD_MIN) {
    throw new Error(`Ustaw SEED_ADMIN_LOGIN i SEED_ADMIN_PASSWORD (min. ${PASSWORD_MIN} znaków) w .env`);
  }

  const existing = await db.staff.findUnique({ where: { login } });
  if (existing) {
    console.log(`[seed] konto "${login}" już istnieje – pomijam`);
    return;
  }

  await db.staff.create({
    data: { login, displayName, role: "ADMIN", passwordHash: await hashPassword(password) },
  });
  console.log(`[seed] utworzono administratora "${login}"`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
