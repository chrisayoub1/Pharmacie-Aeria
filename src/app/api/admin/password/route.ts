import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/admin-auth";
import { verifyStoredPassword, setStoredPassword } from "@/lib/admin-password";

export const runtime = "nodejs";

// Change password from the dashboard (logged-in admin, knows current password)
export async function POST(req: NextRequest) {
  try {
    if (!(await getSessionEmail())) {
      return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
    }
    const { current, next } = await req.json();
    if (!(await verifyStoredPassword(String(current || "")))) {
      return NextResponse.json({ ok: false, error: "Mot de passe actuel incorrect." }, { status: 400 });
    }
    if (String(next || "").length < 8) {
      return NextResponse.json({ ok: false, error: "Le nouveau mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }
    await setStoredPassword(String(next));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur. Réessayez." }, { status: 500 });
  }
}
