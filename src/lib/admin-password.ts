import { createHash, randomBytes } from "crypto";
import { readJson, writeJsonSafe } from "./data-store";

export type Security = { salt: string; hash: string };

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(salt + password).digest("hex");
}

// Password of record lives in the private data repo (security.json).
// Env ADMIN_PASSWORD is only a fallback when the file is missing.
export async function verifyStoredPassword(password: string): Promise<boolean> {
  const sec = await readJson<Security | null>("security.json", null);
  if (sec && sec.salt && sec.hash) {
    // Once a password is stored, ONLY the stored password works
    // (after a change or reset, the old env password is dead).
    return hashPassword(password, sec.salt) === sec.hash;
  }
  return password === (process.env.ADMIN_PASSWORD || "");
}

export async function setStoredPassword(password: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  await writeJsonSafe("security.json", () => ({ salt, hash }), "admin: password updated");
}
