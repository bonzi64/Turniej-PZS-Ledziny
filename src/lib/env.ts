import "server-only";

const DEV_SECRET = "dev-only-pzs-esports-secret-do-not-deploy";

export const env = {
  get authSecret() {
    const secret = process.env.AUTH_SECRET;
    if (secret && secret.length >= 32) return secret;
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET musi mieć co najmniej 32 znaki");
    }
    return DEV_SECRET;
  },
  get registrationOpen() {
    return process.env.REGISTRATION_OPEN !== "false";
  },
  get secureCookies() {
    return process.env.NODE_ENV === "production";
  },
};
