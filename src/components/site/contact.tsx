"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Send, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Reveal } from "./reveal";

export function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Bonjour Pharmacie Aeria,",
      "",
      `Nom : ${form.name}`,
      form.email ? `Email : ${form.email}` : "",
      form.phone ? `Téléphone : ${form.phone}` : "",
      "",
      `Message : ${form.message}`,
    ];
    const text = encodeURIComponent(
      lines.filter((l) => l !== "").join("\n")
    );
    window.open(
      `https://wa.me/212529122323?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
    toast({
      title: "WhatsApp ouvert",
      description:
        "Votre message est prêt. Il ne reste plus qu'à l'envoyer sur WhatsApp.",
    });
    setForm({ name: "", email: "", phone: "", message: "" });
    setDone(true);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 md:py-32 bg-secondary/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left — info + image */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Contact
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-[1.1] sm:leading-[1.08]">
                Parlons de votre santé
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Une question, un besoin ou une demande d'information&nbsp;?
                Écrivez-nous ou contactez directement la pharmacie par
                téléphone.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 space-y-4">
                <a
                  href="tel:0529122323"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary/30"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Téléphone
                    </p>
                    <p className="font-semibold text-foreground">
                      05 29 12 23 23
                    </p>
                  </div>
                </a>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Adresse
                    </p>
                    <p className="font-semibold text-foreground">
                      Aeria Mall, Casablanca 20000, Morocco
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-6 relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-border">
                <Image
                  src="/pharmacy-advice.jpg"
                  alt="Conseil personnalisé à la Pharmacie Aeria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-white p-7 md:p-10 shadow-xl shadow-foreground/5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    autoComplete="name"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="06 00 00 00 00"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-muted p-3.5">
                <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Vos informations sont utilisées uniquement pour répondre à
                  votre demande. Elles ne sont ni partagées ni utilisées à des
                  fins commerciales.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || done}
                className="mt-6 w-full sm:w-auto rounded-full px-8 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : done ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Message envoyé
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer sur WhatsApp
                  </>
                )}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
