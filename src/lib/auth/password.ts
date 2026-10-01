import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// bez "server-only" – używane też przez prisma/seed.ts

const COST: ScryptOptions = { N: 2 ** 15, r: 8, p: 1, maxmem: 96 * 1024 * 1024 };
const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer, length: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, length, options, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, KEY_LENGTH, COST);
  return ["scrypt", COST.N, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, cost, salt, key] = stored.split("$");
  if (algo !== "scrypt" || !salt || !key) return false;

  const expected = Buffer.from(key, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), expected.length, {
    ...COST,
    N: Number(cost),
  });
  return timingSafeEqual(actual, expected);
}

export const PASSWORD_MIN = 10;
