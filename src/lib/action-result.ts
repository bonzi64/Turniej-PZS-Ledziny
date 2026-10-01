export type ActionResult = {
  ok: boolean;
  message: string;
  at: number;
};

export const done = (message: string): ActionResult => ({ ok: true, message, at: Date.now() });

export const fail = (message: string): ActionResult => ({ ok: false, message, at: Date.now() });

export class UserFacingError extends Error {}

export function explain(error: unknown): ActionResult {
  if (error instanceof UserFacingError) return fail(error.message);
  throw error;
}
