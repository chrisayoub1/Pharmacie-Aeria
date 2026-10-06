import { cookies } from "next/headers";

export const COOKIE = "aeria_admin";

// Allowed emails = owner + extras from admins.json (data repo),
// with ADMIN_EMAIL env as fallback if the file is missing.
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  if (!expectedPass) return false;
  const { readJson } = await import("./data-store");
  const admins = await readJson<{ owner: string; extra: string[] }>("admins.json", { owner: "", extra: [] });
  const allowed = [admins.owner, ...(admins.extra || [])]
    .filter(Boolean)
    .map((e) => e.toLowerCase());
  if (allowed.length === 0) {
    (process.env.ADMIN_EMAIL || "").split(",").forEach((e) => e.trim() && allowed.push(e.trim().toLowerCase()));
  }
  const { verifyStoredPassword } = await import("./admin-password");
  return allowed.includes(email.trim().toLowerCase()) && (await verifyStoredPassword(password));
}

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const { verifySession } = await import("./admin-session");
  return verifySession(store.get(COOKIE)?.value);
}

export const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE !== "false", // set COOKIE_SECURE=false only for local http testing
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
