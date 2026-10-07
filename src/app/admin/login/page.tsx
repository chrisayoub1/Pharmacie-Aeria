"use client";

import { useState } from "react";

type Mode = "login" | "forgot" | "reset" | "verify";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      window.location.href = "/admin";
    } else {
      setError(data.error || "Erreur de connexion.");
    }
  };

  const forgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const res = await fetch("/api/admin/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setSuccess("Un code de vérification a été envoyé à votre adresse Gmail. Il est valable 10 minutes.");
      setMode("reset");
    } else {
      setError(data.error || "Erreur.");
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const res = await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password: newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setSuccess("Mot de passe modifié ! Connectez-vous avec le nouveau mot de passe.");
      setMode("login");
      setPassword("");
    } else {
      setError(data.error || "Erreur.");
    }
  };

  const verifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const res = await fetch("/api/admin/verify-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setSuccess("Adresse vérifiée ! Un administrateur principal doit maintenant approuver votre accès.");
      setMode("login");
    } else {
      setError(data.error || "Erreur.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f6] px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-[#0f766e]">Pharmacie Aeria</span>
        </div>

        {mode === "login" && (
          <form onSubmit={login} className="space-y-4">
            <h2 className="text-center text-lg font-semibold text-foreground">Espace administrateur</h2>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-[#0f766e]"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-[#0f766e]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
              className="w-full text-center text-xs text-muted-foreground underline hover:text-[#0f766e]"
            >
              Mot de passe oublié ?
            </button>
            <button
              type="button"
              onClick={() => { setMode("verify"); setError(""); setSuccess(""); }}
              className="w-full text-center text-xs text-muted-foreground underline hover:text-[#0f766e]"
            >
              J&apos;ai reçu un code d&apos;accès
            </button>
          </form>
        )}

        {mode === "verify" && (
          <form onSubmit={verifyAccess} className="space-y-4">
            <h2 className="text-center text-lg font-semibold text-foreground">Vérifier un code d&apos;accès</h2>
            <p className="text-center text-xs text-muted-foreground">
              Un code vous a été envoyé sur Gmail pour confirmer votre adresse.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-[#0f766e]"
            />
            <input
              type="text"
              inputMode="numeric"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code à 6 chiffres"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-center text-lg tracking-widest text-foreground outline-none focus:border-[#0f766e]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-60"
            >
              {loading ? "Validation..." : "Valider le code"}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-center text-xs text-muted-foreground underline hover:text-[#0f766e]">
              Retour à la connexion
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={forgot} className="space-y-4">
            <h2 className="text-center text-lg font-semibold text-foreground">Mot de passe oublié</h2>
            <p className="text-center text-xs text-muted-foreground">
              Entrez votre email administrateur. Nous vous enverrons un code sur Gmail.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-[#0f766e]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer le code"}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-center text-xs text-muted-foreground underline hover:text-[#0f766e]">
              Retour à la connexion
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={reset} className="space-y-4">
            <h2 className="text-center text-lg font-semibold text-foreground">Nouveau mot de passe</h2>
            <p className="text-center text-xs text-muted-foreground">Code envoyé à {email}</p>
            <input
              type="text"
              inputMode="numeric"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code à 6 chiffres"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-center text-lg tracking-widest text-foreground outline-none focus:border-[#0f766e]"
            />
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe (8 caractères min.)"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-[#0f766e]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0d5d56] disabled:opacity-60"
            >
              {loading ? "Validation..." : "Changer le mot de passe"}
            </button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-center text-xs text-muted-foreground underline hover:text-[#0f766e]">
              Retour à la connexion
            </button>
          </form>
        )}

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-xs text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-center text-xs text-emerald-700">{success}</p>}
      </div>
    </div>
  );
}
