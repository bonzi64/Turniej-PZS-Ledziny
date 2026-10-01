import "server-only";

const DEV_SECRET = "dev-only-pzs-esports-secret-do-not-deploy";

function int(name: string, fallback: number) {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export const env = {
  get authSecret() {
    const secret = process.env.AUTH_SECRET;
    if (secret && secret.length >= 32) return secret;
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET musi mieć co najmniej 32 znaki");
    }
    return DEV_SECRET;
  },
  get vetoTurnSeconds() {
    return int("VETO_TURN_SECONDS", 45);
  },
  get rulesMinSeconds() {
    return int("RULES_MIN_SECONDS", 60);
  },
  get registrationOpen() {
    return process.env.REGISTRATION_OPEN !== "false";
  },
  get secureCookies() {
    return process.env.NODE_ENV === "production";
  },
};
