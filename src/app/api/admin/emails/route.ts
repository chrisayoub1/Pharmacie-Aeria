import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { createHash } from "crypto";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

export type Admins = { owner: string; extra: string[]; pending: string[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Access-verification codes for pending admin requests (mirrors reset-codes.json)
type AccessCodes = Record<string, { hash: string; exp: number; verified: boolean; plainCode?: string }>;
const sha = (v: string) => createHash("sha256").update(v).digest("hex");

async function sendAccessCode(to: string, code: string): Promise<{ ok: boolean; error?: string }> {
  if (process.env.SMTP_MODE === "mock" && process.env.NODE_ENV !== "production") {
    console.log("[mock] access code for", to, ":", code);
    return { ok: true };
  }
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return { ok: false, error: "L'envoi d'emails n'est pas encore configuré." };
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: `Pharmacie Aeria <${SMTP_USER}>`,
      to,
      subject: "Code de vérification d'accès · Pharmacie Aeria",
      text: `Bonjour,\n\nUn accès administrateur a été proposé pour cette adresse Gmail.\nVotre code de vérification est : ${code}\n\nEntrez ce code sur la page de connexion (lien \"J'ai reçu un code d'accès\") pour confirmer votre adresse. Il est valable 10 minutes.\n\nPharmacie Aeria`,
      html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;border:1px solid #eee;border-radius:12px;padding:24px">
        <p style="color:#0f766e;font-weight:bold;font-size:16px">Pharmacie Aeria</p>
        <p>Un accès administrateur a été proposé pour cette adresse Gmail.</p>
        <p>Votre code de vérification :</p>
        <p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:#0f766e;background:#f0fdfa;border-radius:8px;padding:12px;text-align:center">${code}</p>
        <p style="font-size:13px;color:#666">Entrez ce code sur la page de connexion pour confirmer votre adresse. Valable 10 minutes.</p>
      </div>`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "L'envoi de l'email a échoué." };
  }
}

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
  const codes = await readJson<Record<string, { verified: boolean }>>("access-codes.json", {});
  const pendingVerified = Object.entries(codes).filter(([, v]) => v.verified).map(([e]) => e);
  const pendingCodes = email === admins.owner
    ? Object.fromEntries(admins.pending.filter((e) => codes[e]?.plainCode && !codes[e].verified).map((e) => [e, codes[e].plainCode as string]))
    : {};
  return NextResponse.json({ ok: true, ...admins, me: email, pendingVerified, pendingCodes });
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
    const codes = await readJson<AccessCodes>("access-codes.json", {});
    if (body.action === "approve") {
      if (!codes[clean]?.verified) {
        return NextResponse.json({ ok: false, error: "Ce Gmail n'a pas encore validé son code de vérification." }, { status: 400 });
      }
      await writeJsonSafe(
        "admins.json",
        (cur: Admins) => ({
          owner: admins.owner,
          extra: [...(admins.extra || []), clean],
          pending: (cur?.pending || []).filter((e) => e !== clean),
        }),
        `admin: approved ${clean}`
      );
      delete codes[clean];
      await writeJsonSafe("access-codes.json", () => codes, `admin: access code cleared for ${clean}`);
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
  // Secondary admin: needs main-admin approval AND Gmail code verification
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codes = await readJson<AccessCodes>("access-codes.json", {});
  codes[clean] = { hash: sha(code), exp: Date.now() + 10 * 60 * 1000, verified: false };
  await writeJsonSafe("access-codes.json", () => codes, `admin: pending request for ${clean}`);
  await writeJsonSafe(
    "admins.json",
    (cur: Admins) => ({ owner: admins.owner, extra: admins.extra, pending: [...(cur?.pending || []), clean] }),
    `admin: pending request for ${clean}`
  );
  const mail = await sendAccessCode(clean, code);
  if (!mail.ok) {
    // Email delivery unavailable: keep the code visible to the owner in the
    // panel so they can hand it over themselves (WhatsApp/phone).
    codes[clean] = { ...codes[clean], plainCode: code };
    await writeJsonSafe("access-codes.json", () => codes, `admin: manual code kept for ${clean}`);
  }
  return NextResponse.json({ ok: true, pending: clean, mailSent: mail.ok, mailError: mail.error });
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
  const codes = await readJson<AccessCodes>("access-codes.json", {});
  if (codes[clean]) {
    delete codes[clean];
    await writeJsonSafe("access-codes.json", () => codes, `admin: access code cleared for ${clean}`);
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
