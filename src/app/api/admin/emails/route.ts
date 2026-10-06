import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

export type Admins = { owner: string; extra: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getAdmins(): Promise<Admins> {
  const admins = await readJson<Admins>("admins.json", { owner: "", extra: [] });
  return {
    owner: admins.owner || process.env.ADMIN_EMAIL?.split(",")[0] || "",
    extra: Array.isArray(admins.extra) ? admins.extra : [],
  };
}

// List allowed emails (owner + extras)
export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const email = await getSessionEmail();
  const admins = await getAdmins();
  return NextResponse.json({ ok: true, ...admins, me: email });
}

// Add a secondary email (owner only)
export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  const admins = await getAdmins();
  if (email !== admins.owner) {
    return NextResponse.json({ ok: false, error: "Seul le compte principal peut gérer les accès." }, { status: 403 });
  }
  const { email: newEmail } = await req.json();
  const clean = String(newEmail || "").trim().toLowerCase();
  if (!EMAIL_RE.test(clean)) {
    return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
  }
  if (clean === admins.owner || admins.extra.includes(clean)) {
    return NextResponse.json({ ok: false, error: "Cet email a déjà accès." }, { status: 400 });
  }
  await writeJsonSafe(
    "admins.json",
    (cur: Admins) => ({ owner: admins.owner, extra: [...(admins.extra || []), clean] }),
    `admin: grant access to ${clean}`
  );
  return NextResponse.json({ ok: true });
}

// Remove a secondary email (owner only)
export async function DELETE(req: NextRequest) {
  const email = await getSessionEmail();
  const admins = await getAdmins();
  if (email !== admins.owner) {
    return NextResponse.json({ ok: false, error: "Seul le compte principal peut gérer les accès." }, { status: 403 });
  }
  const { email: target } = await req.json();
  const clean = String(target || "").trim().toLowerCase();
  if (clean === admins.owner) {
    return NextResponse.json({ ok: false, error: "Le compte principal ne peut pas être supprimé." }, { status: 400 });
  }
  await writeJsonSafe(
    "admins.json",
    (cur: Admins) => ({ owner: admins.owner, extra: (admins.extra || []).filter((e) => e !== clean) }),
    `admin: revoke access for ${clean}`
  );
  return NextResponse.json({ ok: true });
}
