"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Identifiants incorrects.");
      }
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f6] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-border">
            <Image src="/logo.jpg" alt="Pharmacie Aeria" fill sizes="64px" className="object-contain p-2" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pharmacie Aeria · Accès réservé</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5d56] disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
