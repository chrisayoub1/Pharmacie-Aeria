import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    // Save to database
    await db.contactMessage.create({
      data: { name, email, phone: phone || null, message },
    });

    return NextResponse.json({
      ok: true,
      message: "Votre message a bien été envoyé. Nous vous répondrons rapidement.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
