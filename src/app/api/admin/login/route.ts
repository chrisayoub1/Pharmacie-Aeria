import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, SESSION_COOKIE, COOKIE } from "@/lib/admin-auth";
import { writeJsonSafe } from "@/lib/data-store";
import { signSession } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email et mot de passe requis." }, { status: 400 });
    }
    if (!(await checkCredentials(String(email), String(password)))) {
      return NextResponse.json({ ok: false, error: "Identifiants incorrects." }, { status: 401 });
    }
    // Record the login so the main admin can see who accesses the panel.
    try {
      const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "inconnue";
      const ua = (req.headers.get("user-agent") || "").slice(0, 120);
      await writeJsonSafe(
        "logins.json",
        (cur: unknown[]) => [...(Array.isArray(cur) ? cur : []), { email: String(email).trim().toLowerCase(), at: new Date().toISOString(), ip, ua }].slice(-200),
        `login: ${String(email).trim().toLowerCase()}`
      );
    } catch {
      // Never block login because of the log
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, await signSession(String(email).trim().toLowerCase()), SESSION_COOKIE);
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
}
