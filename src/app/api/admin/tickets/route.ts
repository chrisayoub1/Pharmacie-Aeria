import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";

export type Ticket = {
  id: string;
  question: string;
  lang: string;
  date: string;
  status: "open" | "done";
};

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const tickets = await readJson<Ticket[]>("tickets.json", []);
  return NextResponse.json({ ok: true, tickets });
}

export async function PATCH(req: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const { id, status } = await req.json();
  if (!id || !["open", "done"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  await writeJsonSafe(
    "tickets.json",
    (cur: Ticket[]) => {
      const list = Array.isArray(cur) ? cur : [];
      const t = list.find((x) => x.id === id);
      if (t) t.status = status;
      return list;
    },
    `admin: update ticket ${id}`
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  await writeJsonSafe(
    "tickets.json",
    (cur: Ticket[]) => (Array.isArray(cur) ? cur : []).filter((x) => x.id !== id),
    `admin: delete ticket ${id}`
  );
  return NextResponse.json({ ok: true });
}
