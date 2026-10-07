import { NextResponse } from "next/server";
import { readJson } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Login = { email: string; at: string; ip: string; ua: string };

// Recent logins — visible ONLY to the main admin (owner).
export async function GET() {
  const email = await getSessionEmail();
  const admins = await readJson<{ owner: string }>("admins.json", { owner: "" });
  if (!email || email !== (admins.owner || process.env.ADMIN_EMAIL?.split(",")[0])) {
    return NextResponse.json({ ok: false, error: "Réservé au compte principal." }, { status: 403 });
  }
  const logins = await readJson<Login[]>("logins.json", []);
  return NextResponse.json({ ok: true, logins: (logins || []).slice(-100).reverse() });
}
