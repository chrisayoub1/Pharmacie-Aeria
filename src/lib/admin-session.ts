// Edge-compatible session signing using Web Crypto (used by middleware and API routes).

const SECRET = process.env.ADMIN_SECRET || "dev-secret";

function toB64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const bytes = Array.from(new Uint8Array(sig));
  return toB64Url(String.fromCharCode(...bytes));
}

// The email travels base64-encoded so the cookie value stays URL-safe.
export async function signSession(email: string): Promise<string> {
  const exp = Date.now() + 60 * 60 * 24 * 7 * 1000;
  const payload = `${toB64Url(email)}.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [b64, exp, sig] = parts;
  if (Number(exp) < Date.now()) return null;
  const expected = await hmac(`${b64}.${exp}`);
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? fromB64Url(b64) : null;
}
