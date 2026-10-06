import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { readJson, writeJsonSafe } from "@/lib/data-store";

export const runtime = "nodejs";

type Codes = Record<string, { hash: string; exp: number }>;

async function getAllowedEmails(): Promise<string[]> {
  const admins = await readJson<{ owner: string; extra: string[] }>("admins.json", { owner: "", extra: [] });
  const list = [admins.owner, ...(admins.extra || [])].filter(Boolean).map((e) => e.toLowerCase());
  if (list.length === 0) {
    (process.env.ADMIN_EMAIL || "").split(",").forEach((e) => e.trim() && list.push(e.trim().toLowerCase()));
  }
  return list;
}

function sendMailOpts(to: string, code: string) {
  return {
    from: `Pharmacie Aeria <${process.env.SMTP_USER || process.env.SMTP_FROM || "noreply@pharmacieaeria.ma"}>`,
    to,
    subject: "Code de réinitialisation · Pharmacie Aeria",
    text: `Bonjour,\n\nVotre code de vérification est : ${code}\n\nIl est valable 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nPharmacie Aeria`,
    html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;border:1px solid #eee;border-radius:12px;padding:24px">
      <p style="color:#0f766e;font-weight:bold;font-size:16px">Pharmacie Aeria</p>
      <p>Bonjour,</p>
      <p>Votre code de vérification :</p>
      <p style="font-size:30px;font-weight:bold;letter-spacing:6px;color:#0f766e;background:#f0fdfa;border-radius:8px;padding:12px;text-align:center">${code}</p>
      <p style="font-size:13px;color:#666">Valable 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>`,
  };
}

// Step 1: request a reset code for an admin email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const clean = String(email || "").trim().toLowerCase();
    const allowed = await getAllowedEmails();

    // Never reveal whether the email is an admin account.
    if (!clean || !allowed.includes(clean)) {
      return NextResponse.json({ ok: true, sent: false });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const exp = Date.now() + 10 * 60 * 1000;
    const codes = await readJson<Codes>("reset-codes.json", {});
    codes[clean] = { hash: createHash("sha256").update(code).digest("hex"), exp };
    await writeJsonSafe("reset-codes.json", () => codes, "admin: reset code requested");

    // Dev-only mock so the flow can be tested without SMTP credentials.
    if (process.env.SMTP_MODE === "mock" && process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true, sent: true, devCode: code });
    }

    const { SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ ok: false, error: "L'envoi d'emails n'est pas encore configuré. Contactez l'administrateur du site." });
    }
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail(sendMailOpts(clean, code));
    return NextResponse.json({ ok: true, sent: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur. Réessayez." }, { status: 500 });
  }
}
