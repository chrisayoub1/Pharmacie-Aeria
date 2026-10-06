import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, SESSION_COOKIE, COOKIE } from "@/lib/admin-auth";
import { signSession } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email et mot de passe requis." }, { status: 400 });
    }
    if (!checkCredentials(String(email), String(password))) {
      return NextResponse.json({ ok: false, error: "Identifiants incorrects." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, await signSession(String(email).trim().toLowerCase()), SESSION_COOKIE);
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
}
