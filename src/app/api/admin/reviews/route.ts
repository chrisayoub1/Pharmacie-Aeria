import { NextResponse } from "next/server";
import { readJson } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Google Maps reviews snapshot for the admin panel (reviews.json in the data repo).
export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const data = await readJson<{
    rating: number;
    count: number;
    updated: string;
    items: { author: string; stars: number; date: string; text: string; reply?: string }[];
  } | null>("reviews.json", null);
  if (!data) {
    return NextResponse.json({ ok: true, rating: null, count: 0, items: [], updated: null });
  }
  return NextResponse.json({ ok: true, ...data });
}
