"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { LogOut, RefreshCw, Eye, Users, MessageSquare, Globe, Monitor, ExternalLink, Check, Trash2, RotateCcw, UserPlus, ShieldCheck } from "lucide-react";

type Stats = {
  totalViews: number;
  views7: number;
  views30: number;
  openTickets: number;
  days: { date: string; views: number }[];
  languages: [string, number][];
  referrers: [string, number][];
  devices: [string, number][];
};
type Ticket = { id: string; question: string; lang: string; date: string; status: "open" | "done" };

const LANG_FLAG: Record<string, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇲🇦" };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<{ owner: string; extra: string[] }>({ owner: "", extra: [] });
  const [me, setMe] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t, e] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/tickets").then((r) => r.json()),
        fetch("/api/admin/emails").then((r) => r.json()),
      ]);
      if (s.ok) setStats(s.stats);
      if (t.ok) setTickets(t.tickets);
      if (e.ok) {
        setAdmins({ owner: e.owner, extra: e.extra || [] });
        setMe(e.me || e.owner);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setTicketStatus = async (id: string, status: "open" | "done") => {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)));
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };
  const deleteTicket = async (id: string) => {
    setTickets((ts) => ts.filter((t) => t.id !== id));
    await fetch("/api/admin/tickets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };
  const addEmail = async () => {
    setEmailMsg("");
    const res = await fetch("/api/admin/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });
    const data = await res.json();
    if (data.ok) {
      setAdmins((a) => ({ ...a, extra: [...a.extra, newEmail.trim().toLowerCase()] }));
      setNewEmail("");
      setEmailMsg("✓ Accès ajouté pour " + newEmail.trim().toLowerCase());
    } else {
      setEmailMsg(data.error || "Erreur.");
    }
  };
  const removeEmail = async (email: string) => {
    await fetch("/api/admin/emails", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setAdmins((a) => ({ ...a, extra: a.extra.filter((x) => x !== email) }));
  };
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const maxViews = Math.max(1, ...(stats?.days.map((d) => d.views) || [1]));

  const TopList = ({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: [string, number][] }) => {
    const total = rows.reduce((a, r) => a + r[1], 0) || 1;
    return (
      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {icon} {title}
        </p>
        <div className="mt-3 space-y-2.5">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">Pas encore de données.</p>}
          {rows.map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-secondary">
                <div className="h-1.5 rounded-full bg-[#0f766e]" style={{ width: `${(v / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StatTile = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
    <div className="rounded-2xl border border-border bg-white p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{icon} {label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f6] pb-16">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border">
              <Image src="/logo.jpg" alt="Pharmacie Aeria" fill sizes="40px" className="object-contain p-1" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Pharmacie Aeria · Admin</p>
              <p className="text-xs text-muted-foreground">Tableau de bord</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://pharmacieaeria.ma" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </a>
            <button onClick={load} className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} /> Actualiser
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 rounded-full bg-[#0f766e] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#0d5d56]">
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        {/* Stats tiles */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Vues totales" value={stats?.totalViews ?? "—"} icon={<Eye className="h-3.5 w-3.5" />} />
          <StatTile label="Vues (7 jours)" value={stats?.views7 ?? "—"} icon={<Users className="h-3.5 w-3.5" />} />
          <StatTile label="Vues (30 jours)" value={stats?.views30 ?? "—"} icon={<Eye className="h-3.5 w-3.5" />} />
          <StatTile label="Tickets ouverts" value={stats?.openTickets ?? "—"} icon={<MessageSquare className="h-3.5 w-3.5" />} />
        </div>

        {/* Traffic chart */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="mr-2 inline h-3.5 w-3.5" /> Vues des 30 derniers jours
          </p>
          <div className="mt-5 flex h-44 items-end gap-1.5">
            {(stats?.days || []).length === 0 && (
              <p className="text-sm text-muted-foreground">Pas encore de données de trafic.</p>
            )}
            {stats?.days.map((d) => (
              <div key={d.date} className="group relative flex-1">
                <div
                  className="w-full rounded-t-md bg-[#0f766e]/80 transition-all hover:bg-[#0f766e]"
                  style={{ height: `${Math.max(3, (d.views / maxViews) * 160)}px` }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[11px] text-white group-hover:block">
                  {d.date} · {d.views} vues
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown lists */}
        <div className="grid gap-4 md:grid-cols-3">
          <TopList title="Langues (30 j)" icon={<Globe className="h-3.5 w-3.5" />} rows={stats?.languages || []} />
          <TopList title="Sources (30 j)" icon={<ExternalLink className="h-3.5 w-3.5" />} rows={stats?.referrers || []} />
          <TopList title="Appareils (30 j)" icon={<Monitor className="h-3.5 w-3.5" />} rows={stats?.devices || []} />
        </div>

        {/* Authorized accounts */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="mr-2 inline h-3.5 w-3.5" /> Comptes autorisés (emails)
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-2 rounded-full bg-[#0f766e]/10 px-4 py-2 text-xs font-semibold text-[#0f766e]">
              <ShieldCheck className="h-3.5 w-3.5" /> {admins.owner} · principal
            </span>
            {admins.extra.map((e) => (
              <span key={e} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground">
                {e}
                {me === admins.owner && (
                  <button onClick={() => removeEmail(e)} aria-label={"Retirer " + e} className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {me === admins.owner ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ajouter@gmail.com"
                className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
              <button
                onClick={addEmail}
                disabled={!newEmail}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" /> Ajouter
              </button>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">Seul le compte principal peut ajouter ou retirer des accès.</p>
          )}
          {emailMsg && <p className="mt-2 text-xs text-muted-foreground">{emailMsg}</p>}
        </div>

        {/* Tickets */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MessageSquare className="mr-2 inline h-3.5 w-3.5" />
            Questions sans réponse du chatbot ({tickets.filter((t) => t.status === "open").length} ouvertes)
          </p>
          <div className="mt-4 space-y-3">
            {tickets.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucun ticket. Les questions que le chatbot n&apos;arrive pas à répondre apparaîtront ici.
              </p>
            )}
            {tickets.map((t) => (
              <div key={t.id} className={"flex items-start gap-3 rounded-xl border p-4 " + (t.status === "open" ? "border-amber-200 bg-amber-50" : "border-border bg-white opacity-75")}>
                <span className="text-lg leading-none">{LANG_FLAG[t.lang] || "🌐"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{t.question}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(t.date).toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" })} · {t.lang.toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  {t.status === "open" ? (
                    <button onClick={() => setTicketStatus(t.id, "done")} className="flex items-center gap-1 rounded-full bg-[#0f766e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0d5d56]">
                      <Check className="h-3 w-3" /> Traité
                    </button>
                  ) : (
                    <button onClick={() => setTicketStatus(t.id, "open")} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">
                      <RotateCcw className="h-3 w-3" /> Rouvrir
                    </button>
                  )}
                  <button onClick={() => deleteTicket(t.id)} aria-label="Supprimer" className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
