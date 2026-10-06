# Pharmacie Aeria — Website

Site web officiel de la **Pharmacie Aeria** (Aeria Mall, Casablanca, Maroc).

Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui. Importé depuis le projet Z.ai (Space.z.ai).

## Sections
- Hero avec vidéo (MP4)
- Bienvenue / Bandeau
- Pharmacie & Parapharmacie
- Services & Conseils santé (slideshow)
- Localisation (Google Maps, itinéraire)
- Contact (formulaire — Prisma + SQLite)
- Chatbot assistant

## Développement
```bash
bun install      # ou: npm install
cp .env.example .env
bun run dev      # ou: npm run dev
```

## Déploiement (Vercel)
1. Importer ce dépôt sur [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (détecté automatiquement)
3. Variable d'environnement: `DATABASE_URL` (voir `.env.example`)
4. Deploy

> **Note SQLite:** le système de fichiers serverless de Vercel est en lecture seule,
> donc le formulaire de contact (base SQLite) ne persistera pas en production Vercel.
> Pour un formulaire fonctionnel, migrer vers Vercel Postgres / Turso / Supabase.
> Le site s'affiche et fonctionne parfaitement par ailleurs.

## Contact
- Téléphone: 05 29 12 23 23
- Adresse: Aeria Mall, Casablanca, Maroc
