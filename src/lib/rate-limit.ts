import "server-only";
import { db } from "@/lib/db";

export type Throttle = { ok: true } | { ok: false; retryIn: number };

export async function throttle(key: string, limit: number, windowSeconds: number): Promise<Throttle> {
  const now = new Date();
  const row = await db.rateLimit.findUnique({ where: { key } });

  if (!row || row.resetAt <= now) {
    const resetAt = new Date(now.getTime() + windowSeconds * 1000);
    await db.rateLimit.upsert({
      where: { key },
      create: { key, hits: 1, resetAt },
      update: { hits: 1, resetAt },
    });
    return { ok: true };
  }

  if (row.hits >= limit) {
    return { ok: false, retryIn: Math.ceil((row.resetAt.getTime() - now.getTime()) / 1000) };
  }

  await db.rateLimit.update({ where: { key }, data: { hits: { increment: 1 } } });
  return { ok: true };
}

export const forgive = (key: string) => db.rateLimit.deleteMany({ where: { key } });
