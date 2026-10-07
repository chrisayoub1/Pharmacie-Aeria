"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { LogOut, RefreshCw, Eye, Users, MessageSquare, Globe, Monitor, ExternalLink, Check, Trash2, RotateCcw, UserPlus, ShieldCheck, Clock, Star } from "lucide-react";

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
  const [admins, setAdmins] = useState<{ owner: string; extra: string[]; pending: string[] }>({ owner: "", extra: [], pending: [] });
  const [me, setMe] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [curPass, setCurPass] = useState("");
  const [nextPass, setNextPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [reviews, setReviews] = useState<{ rating: number | null; count: number; updated: string | null; items: { author: string; stars: number; date: string; text: string; reply?: string }[] }>({ rating: null, count: 0, updated: null, items: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t, e, rv] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/tickets").then((r) => r.json()),
        fetch("/api/admin/emails").then((r) => r.json()),
        fetch("/api/admin/reviews").then((r) => r.json()),
      ]);
      if (s.ok) setStats(s.stats);
      if (t.ok) setTickets(t.tickets);
      if (e.ok) {
        setAdmins({ owner: e.owner, extra: e.extra || [], pending: e.pending || [] });
        setMe(e.me || e.owner);
      }
      if (rv.ok) setReviews({ rating: rv.rating ?? null, count: rv.count || 0, updated: rv.updated || null, items: rv.items || [] });
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
      const clean = newEmail.trim().toLowerCase();
      setNewEmail("");
      if (data.pending) {
        setAdmins((a) => ({ ...a, pending: [...a.pending, clean] }));
        setEmailMsg("Demande envoyée : " + clean + " doit être approuvé par le compte principal.");
      } else {
        setAdmins((a) => ({ ...a, extra: [...a.extra, clean] }));
        setEmailMsg("✓ Accès ajouté pour " + clean);
      }
    } else {
      setEmailMsg(data.error || "Erreur.");
    }
  };
  const reviewEmail = async (email: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, email }),
    });
    const data = await res.json();
    if (data.ok) {
      if (action === "approve") {
        setAdmins((a) => ({ owner: a.owner, extra: [...a.extra, email], pending: a.pending.filter((x) => x !== email) }));
        setEmailMsg("✓ " + email + " approuvé.");
      } else {
        setAdmins((a) => ({ ...a, pending: a.pending.filter((x) => x !== email) }));
        setEmailMsg("Demande refusée pour " + email + ".");
      }
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
  const changePassword = async () => {
    setPassMsg("");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: curPass, next: nextPass }),
    });
    const data = await res.json();
    if (data.ok) {
      setCurPass(""); setNextPass("");
      setPassMsg("✓ Mot de passe modifié.");
    } else {
      setPassMsg(data.error || "Erreur.");
    }
  };
  const fmtDur = (sec: number | undefined) => {
    if (!sec) return "—";
    if (sec < 60) return sec + "s";
    const m = Math.floor(sec / 60);
    const r = sec % 60;
    return m + "m " + (r ? r + "s" : "");
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
          <StatTile label="Visiteurs" value={stats?.totalVisitors ?? "—"} icon={<Users className="h-3.5 w-3.5" />} />
          <StatTile label="Durée moyenne" value={fmtDur(stats?.avgSeconds)} icon={<Clock className="h-3.5 w-3.5" />} />
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

        {/* Google Maps reviews */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Star className="mr-2 inline h-3.5 w-3.5 fill-current text-amber-400" /> Avis Google Maps
            </p>
            {reviews.rating ? (
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{reviews.rating}★</span> · {reviews.count} avis · mis à jour le {reviews.updated}
              </p>
            ) : null}
          </div>
          <div className="mt-4 space-y-4">
            {reviews.items.length === 0 && <p className="text-xs text-muted-foreground">Aucun avis chargé.</p>}
            {reviews.items.map((r, i) => (
              <div key={i} className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{r.author}</p>
                  <p className="text-xs text-amber-500">{"★".repeat(r.stars)}<span className="text-muted-foreground">{"★".repeat(5 - r.stars)}</span></p>
                </div>
                <p className="text-[11px] text-muted-foreground">{r.date}</p>
                <p className="mt-2 text-xs leading-relaxed text-foreground">{r.text}</p>
                {r.reply && (
                  <p className="mt-2 rounded-lg bg-[#f0fdfa] p-3 text-xs leading-relaxed text-[#0f766e]">
                    <span className="font-semibold">Votre réponse :</span> {r.reply}
                  </p>
                )}
              </div>
            ))}
          </div>
          <a
            href="https://www.google.com/maps/place/Pharmacie+Aeria/"
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0f766e] hover:underline"
          >
            Voir tous les avis sur Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="mr-2 inline h-3.5 w-3.5" /> Changer le mot de passe
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="password"
              value={curPass}
              onChange={(e) => setCurPass(e.target.value)}
              placeholder="Mot de passe actuel"
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <input
              type="password"
              value={nextPass}
              onChange={(e) => setNextPass(e.target.value)}
              placeholder="Nouveau mot de passe (8 min.)"
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              onClick={changePassword}
              disabled={!curPass || nextPass.length < 8}
              className="rounded-xl bg-[#0f766e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-50"
            >
              Modifier
            </button>
          </div>
          {passMsg && <p className="mt-2 text-xs text-muted-foreground">{passMsg}</p>}
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
          {admins.pending.length > 0 && me === admins.owner && (
            <div className="mt-4 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Demandes en attente d&apos;approbation</p>
              {admins.pending.map((e) => (
                <div key={e} className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">{e}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => reviewEmail(e, "approve")}
                      className="rounded-lg bg-[#0f766e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0d5d56]"
                    >
                      ✓ Approuver
                    </button>
                    <button
                      onClick={() => reviewEmail(e, "reject")}
                      className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:border-red-300 hover:text-red-600"
                    >
                      ✗ Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={me === admins.owner ? "ajouter@gmail.com" : "proposer@gmail.com"}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              onClick={addEmail}
              disabled={!newEmail}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" /> {me === admins.owner ? "Ajouter" : "Proposer"}
            </button>
          </div>
          {me === admins.owner ? (
            <p className="mt-2 text-[11px] text-muted-foreground">Vous êtes le compte principal : les Gmail que vous ajoutez ont directement accès.</p>
          ) : (
            <p className="mt-2 text-[11px] text-muted-foreground">Toute nouvelle adresse doit être approuvée par {admins.owner} avant d&apos;avoir accès au tableau de bord.</p>
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
