import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

export type Admins = { owner: string; extra: string[]; pending: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getAdmins(): Promise<Admins> {
  const admins = await readJson<Admins>("admins.json", { owner: "", extra: [], pending: [] });
  return {
    owner: admins.owner || process.env.ADMIN_EMAIL?.split(",")[0] || "",
    extra: Array.isArray(admins.extra) ? admins.extra : [],
    pending: Array.isArray(admins.pending) ? admins.pending : [],
  };
}

const normalize = (raw: unknown) => String(raw || "").trim().toLowerCase();

// List allowed emails (owner + extras) and pending requests
export async function GET() {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const admins = await getAdmins();
  return NextResponse.json({ ok: true, ...admins, me: email });
}

// Add a Gmail.
// - Owner (main admin): added directly with full access.
// - Other admins: the request goes to PENDING and MUST be approved
//   by the main admin before the new Gmail can access the panel.
export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const admins = await getAdmins();
  const isOwner = email === admins.owner;
  const body = await req.json().catch(() => ({}));

  // Approve / reject a pending request (main admin only)
  if (body.action === "approve" || body.action === "reject") {
    if (!isOwner) {
      return NextResponse.json({ ok: false, error: "Seul le compte principal peut approuver ou refuser les accès." }, { status: 403 });
    }
    const clean = normalize(body.email);
    if (!admins.pending.includes(clean)) {
      return NextResponse.json({ ok: false, error: "Demande introuvable." }, { status: 404 });
    }
    if (body.action === "approve") {
      await writeJsonSafe(
        "admins.json",
        (cur: Admins) => ({
          owner: admins.owner,
          extra: [...(admins.extra || []), clean],
          pending: (cur?.pending || []).filter((e) => e !== clean),
        }),
        `admin: approved ${clean}`
      );
      return NextResponse.json({ ok: true, approved: clean });
    }
    await writeJsonSafe(
      "admins.json",
      (cur: Admins) => ({ owner: admins.owner, extra: admins.extra, pending: (cur?.pending || []).filter((e) => e !== clean) }),
      `admin: rejected ${clean}`
    );
    return NextResponse.json({ ok: true, rejected: clean });
  }

  // New access request
  const clean = normalize(body.email);
  if (!EMAIL_RE.test(clean)) {
    return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
  }
  if (clean === admins.owner || admins.extra.includes(clean)) {
    return NextResponse.json({ ok: false, error: "Cet email a déjà accès." }, { status: 400 });
  }
  if (admins.pending.includes(clean)) {
    return NextResponse.json({ ok: false, error: "Une demande est déjà en attente pour cet email." }, { status: 400 });
  }
  if (isOwner) {
    await writeJsonSafe(
      "admins.json",
      (cur: Admins) => ({ owner: admins.owner, extra: [...(admins.extra || []), clean], pending: cur?.pending || admins.pending }),
      `admin: grant access to ${clean}`
    );
    return NextResponse.json({ ok: true, granted: clean });
  }
  // Secondary admin: needs main-admin approval
  await writeJsonSafe(
    "admins.json",
    (cur: Admins) => ({ owner: admins.owner, extra: admins.extra, pending: [...(cur?.pending || []), clean] }),
    `admin: pending request for ${clean}`
  );
  return NextResponse.json({ ok: true, pending: clean });
}

// Remove an admin (main admin only — the main admin controls ALL admin accounts)
export async function DELETE(req: NextRequest) {
  const email = await getSessionEmail();
  const admins = await getAdmins();
  if (email !== admins.owner) {
    return NextResponse.json({ ok: false, error: "Seul le compte principal peut retirer des accès." }, { status: 403 });
  }
  const clean = normalize((await req.json().catch(() => ({}))).email);
  if (clean === admins.owner) {
    return NextResponse.json({ ok: false, error: "Le compte principal ne peut pas être supprimé." }, { status: 400 });
  }
  await writeJsonSafe(
    "admins.json",
    (cur: Admins) => ({
      owner: admins.owner,
      extra: (cur?.extra || []).filter((e) => e !== clean),
      pending: (cur?.pending || []).filter((e) => e !== clean),
    }),
    `admin: revoke access for ${clean}`
  );
  return NextResponse.json({ ok: true });
}
