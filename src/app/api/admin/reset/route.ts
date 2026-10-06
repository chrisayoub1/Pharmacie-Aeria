import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { setStoredPassword } from "@/lib/admin-password";

export const runtime = "nodejs";

type Codes = Record<string, { hash: string; exp: number }>;

// Step 2: verify the code and set the new password
export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();
    const clean = String(email || "").trim().toLowerCase();
    const theCode = String(code || "").trim();
    const newPass = String(password || "");

    if (newPass.length < 8) {
      return NextResponse.json({ ok: false, error: "Le mot de passe doit contenir au moins 8 caractères." });
    }
    const codes = await readJson<Codes>("reset-codes.json", {});
    const entry = codes[clean];
    if (!entry || entry.exp < Date.now()) {
      return NextResponse.json({ ok: false, error: "Code invalide ou expiré." });
    }
    if (createHash("sha256").update(theCode).digest("hex") !== entry.hash) {
      return NextResponse.json({ ok: false, error: "Code invalide ou expiré." });
    }
    await setStoredPassword(newPass);
    delete codes[clean];
    await writeJsonSafe("reset-codes.json", () => codes, "admin: reset code used");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur. Réessayez." }, { status: 500 });
  }
}
