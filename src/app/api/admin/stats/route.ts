import { NextResponse } from "next/server";
import { readJson } from "@/lib/data-store";
import { getSessionEmail } from "@/lib/admin-auth";
type Ticket = { id: string; question: string; lang: string; date: string; status: "open" | "done" };

export const runtime = "nodejs";

type DayStats = {
  date: string; // YYYY-MM-DD
  views: number;
  visitors: number;
  languages: Record<string, number>;
  referrers: Record<string, number>;
  devices: Record<string, number>;
  secs?: number;
  ended?: number;
};

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const [days, tickets] = await Promise.all([
    readJson<DayStats[]>("traffic.json", []),
    readJson<Ticket[]>("tickets.json", []),
  ]);

  const totalViews = days.reduce((a, d) => a + d.views, 0);
  const last30 = days.slice(-30);
  const views7 = days.slice(-7).reduce((a, d) => a + d.views, 0);
  const views30 = last30.reduce((a, d) => a + d.views, 0);

  const agg = (key: "languages" | "referrers" | "devices") => {
    const out: Record<string, number> = {};
    for (const d of last30) {
      for (const [k, v] of Object.entries(d[key] || {})) out[k] = (out[k] || 0) + v;
    }
    return Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 8);
  };

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const totalVisitors = days.reduce((a, d) => a + (d.visitors || 0), 0);
  const totalSecs = last30.reduce((a, d) => a + (d.secs || 0), 0);
  const totalEnded = last30.reduce((a, d) => a + (d.ended || 0), 0);
  const avgSeconds = totalEnded > 0 ? Math.round(totalSecs / totalEnded) : 0;

  return NextResponse.json({
    ok: true,
    stats: {
      totalViews,
      totalVisitors,
      avgSeconds,
      views7,
      views30,
      openTickets,
      days: last30.map((d) => ({ date: d.date, views: d.views })),
      languages: agg("languages"),
      referrers: agg("referrers"),
      devices: agg("devices"),
    },
  });
}
