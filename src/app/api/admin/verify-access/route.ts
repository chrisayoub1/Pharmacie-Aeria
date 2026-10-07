import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { createHash } from "crypto";

export const runtime = "nodejs";

type AccessCodes = Record<string, { hash: string; exp: number; verified: boolean }>;

// Public: the proposed Gmail confirms they control their inbox by entering
// the 6-digit code that was emailed to them. Owner approval is still required after.
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json().catch(() => ({}));
    const clean = String(email || "").trim().toLowerCase();
    const value = String(code || "").trim();
    const admins = await readJson<{ owner: string; extra: string[]; pending: string[] }>("admins.json", { owner: "", extra: [], pending: [] });
    if (!admins.pending?.includes(clean)) {
      return NextResponse.json({ ok: false, error: "Aucune demande en attente pour cet email." }, { status: 404 });
    }
    const codes = await readJson<AccessCodes>("access-codes.json", {});
    const entry = codes[clean];
    if (!entry) {
      return NextResponse.json({ ok: false, error: "Aucun code trouvé. Demandez à renvoyer la demande." }, { status: 404 });
    }
    if (Date.now() > entry.exp) {
      return NextResponse.json({ ok: false, error: "Code expiré." }, { status: 400 });
    }
    if (createHash("sha256").update(value).digest("hex") !== entry.hash) {
      return NextResponse.json({ ok: false, error: "Code incorrect." }, { status: 401 });
    }
    codes[clean] = { ...entry, verified: true };
    await writeJsonSafe("access-codes.json", () => codes, `admin: ${clean} verified their access code`);
    return NextResponse.json({ ok: true, verified: clean });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur. Réessayez." }, { status: 500 });
  }
}
