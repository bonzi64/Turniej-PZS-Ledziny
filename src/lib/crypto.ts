import "server-only";
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");

export const makePin = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

function mac(payload: string) {
  return createHmac("sha256", env.authSecret).update(payload).digest("base64url");
}

export function sameString(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const seal = (payload: string) => `${payload}.${mac(payload)}`;

export function unseal(sealed: string | null | undefined) {
  if (!sealed) return null;
  const cut = sealed.lastIndexOf(".");
  if (cut < 1) return null;
  const payload = sealed.slice(0, cut);
  return sameString(sealed.slice(cut + 1), mac(payload)) ? payload : null;
}

export function shuffled<T>(items: readonly T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
