import { cookies } from "next/headers";

export const COOKIE = "aeria_admin";

export function checkCredentials(email: string, password: string): boolean {
  // ADMIN_EMAIL can contain several allowed emails, comma-separated.
  const allowed = (process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  return (
    allowed.length > 0 &&
    expectedPass.length > 0 &&
    allowed.includes(email.trim().toLowerCase()) &&
    password === expectedPass
  );
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
