import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJsonSafe } from "@/lib/data-store";

export const runtime = "nodejs";

type DayStats = {
  date: string;
  views: number;
  visitors: number;
  languages: Record<string, number>;
  referrers: Record<string, number>;
  devices: Record<string, number>;
  secs?: number;
  ended?: number;
};

// Very lightweight, cookie-free analytics: one row per day, no PII.
export async function POST(req: NextRequest) {
  try {
    const { newVisitor, duration } = await req.json().catch(() => ({}));

    const day = new Date().toLocaleDateString("sv-SE", { timeZone: "Africa/Casablanca" }); // YYYY-MM-DD

    // Visit duration ping (sent when the visitor leaves the site)
    if (duration) {
      const secs = Math.min(Number(duration) || 0, 3600);
      await writeJsonSafe("traffic.json", (cur: DayStats[]) => {
        const days = Array.isArray(cur) ? cur : [];
        let d = days.find((x) => x.date === day);
        if (!d) {
          d = { date: day, views: 0, visitors: 0, languages: {}, referrers: {}, devices: {} };
          days.push(d);
        }
        d.secs = (d.secs || 0) + secs;
        d.ended = (d.ended || 0) + 1;
        return days;
      }, "traffic: visit duration");
      return NextResponse.json({ ok: true });
    }

    // Derive device / language / referrer from request headers
    const ua = req.headers.get("user-agent") || "";
    const device = /mobile|android|iphone/i.test(ua) ? "Mobile" : /ipad|tablet/i.test(ua) ? "Tablet" : "Desktop";
    const lang = (req.headers.get("accept-language") || "fr").slice(0, 2).toLowerCase();
    const ref = req.headers.get("referer") || "";
    let referrer = "Direct";
    if (ref) {
      try {
        referrer = new URL(ref).hostname.replace(/^www\./, "");
      } catch {
        referrer = "Autre";
      }
    }

    await writeJsonSafe(
      "traffic.json",
      (cur: DayStats[]) => {
        const days = Array.isArray(cur) ? cur : [];
        let d = days.find((x) => x.date === day);
        if (!d) {
          d = { date: day, views: 0, visitors: 0, languages: {}, referrers: {}, devices: {} };
          days.push(d);
          days.sort((a, b) => a.date.localeCompare(b.date));
          // keep last 365 days only
          if (days.length > 365) days.splice(0, days.length - 365);
        }
        d.views += 1;
        if (newVisitor) d.visitors += 1;
        d.languages[lang] = (d.languages[lang] || 0) + 1;
        d.referrers[referrer] = (d.referrers[referrer] || 0) + 1;
        d.devices[device] = (d.devices[device] || 0) + 1;
        return days;
      },
      `track: ${day}`
    );
    return NextResponse.json({ ok: true });
  } catch {
    // Never break the visitor's page because of analytics
    return NextResponse.json({ ok: false });
  }
}
