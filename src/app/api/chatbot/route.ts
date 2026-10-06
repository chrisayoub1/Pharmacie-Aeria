import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PHONE = "05 29 12 23 23";
const ADDRESS = "Aeria Mall, Casablanca 20000, Maroc";

type Rule = {
  keywords: string[];
  reply: () => string;
};

const RULES: Rule[] = [
  {
    keywords: ["urgence", "urgent", "emergency", "sos"],
    reply: () =>
      `En cas d'urgence, appelez directement la Pharmacie Aeria au ${PHONE} ou le 141 (SAMU). Nous sommes situés à ${ADDRESS}.`,
  },
  {
    keywords: ["horaires", "heure d'ouverture", "heures", "ouvert", "ouvre", "ferme", "fermé", "fermeture", "opening", "schedule", "وقت"],
    reply: () =>
      `Pour connaître nos horaires d'ouverture exacts, le plus sûr est d'appeler la pharmacie au ${PHONE}. Nous sommes situés à ${ADDRESS}.`,
  },
  {
    keywords: ["adresse", "localisation", "situe", "situé", "trouve", "ou se trouve", "itineraire", "itinéraire", "localisation", "map", "plan", "mall", "emplacement", "location", "عنوان", "مكان"],
    reply: () =>
      `La Pharmacie Aeria se trouve à ${ADDRESS}, au sein de l'Aeria Mall. Passez nous voir, nous serons ravis de vous accueillir !`,
  },
  {
    keywords: ["telephone", "téléphone", "numero", "numéro", "appeler", "appel", "contact", "joindre", "phone", "call", "رقم", "اتصال"],
    reply: () =>
      `Vous pouvez joindre la Pharmacie Aeria au ${PHONE}. N'hésitez pas à nous appeler pour toute question sur nos produits ou services.`,
  },
  {
    keywords: ["parapharmacie", "parapharma", "cosmetique", "cosmétique", "beaute", "beauté", "soin", "hygiene", "hygiène", "creme", "crème", "shampoing"],
    reply: () =>
      "Notre parapharmacie propose une large sélection de produits de beauté, d'hygiène et de soins : crèmes, shampoings, compléments alimentaires et bien plus. Passez en pharmacie pour découvrir la sélection, ou appelez-nous pour vérifier la disponibilité d'un produit.",
  },
  {
    keywords: ["service", "conseil", "accompagnement", "professionnel"],
    reply: () =>
      "La Pharmacie Aeria vous accompagne avec : conseil pharmaceutique personnalisé, produits de santé, parapharmacie, hygiène & soins et bien-être. Notre équipe est là pour vous orienter au mieux.",
  },
  {
    keywords: ["ordonnance", "prescription", "medicament", "médicament", "traitement", "renouveler"],
    reply: () =>
      "Nous délivrons bien sûr les ordonnances et conseils associés. Apportez votre ordonnance en pharmacie, ou appelez-nous au " + PHONE + " pour vérifier la disponibilité d'un médicament.",
  },
  {
    keywords: ["livraison", "domicile", "livrer", "delivery", "apporter"],
    reply: () =>
      `Pour toute demande de livraison à domicile, merci de nous appeler au ${PHONE} : nous vous indiquerons les modalités.`,
  },
  {
    keywords: ["prix", "tarif", "cout", "coût", "combien", "cher", "price"],
    reply: () =>
      `Les prix varient selon les produits, le mieux est de nous appeler au ${PHONE} ou de passer en pharmacie pour obtenir le tarif exact.`,
  },
  {
    keywords: ["stock", "disponible", "disponibilite", "disponibilité", "avoir"],
    reply: () =>
      `Pour vérifier la disponibilité d'un produit en stock, appelez-nous au ${PHONE} : nous vous répondrons immédiatement.`,
  },
  {
    keywords: ["bonjour", "bonsoir", "salut", "hello", "coucou", "salam", "salaam", "مرحبا", "السلام"],
    reply: () =>
      "Bonjour et bienvenue ! Je suis l'assistant de la Pharmacie Aeria. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser vos questions sur nos services, produits ou la localisation de la pharmacie.",
  },
  {
    keywords: ["merci", "thanks", "choukran", "شكرا"],
    reply: () =>
      "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Au plaisir de vous accueillir à l'Aeria Mall.",
  },
];

const FALLBACK = () =>
  `Je ne suis pas certain de bien comprendre votre demande. Je peux vous renseigner sur nos services, notre parapharmacie, notre adresse et comment nous contacter. Pour toute question précise, appelez-nous au ${PHONE} — nous serons ravis de vous aider.`;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: { role: string; content?: string }[] = Array.isArray(
      body.messages
    )
      ? body.messages
      : [];

    const last = messages[messages.length - 1];
    const question = normalize(String(last?.content ?? ""));

    if (!question) {
      return NextResponse.json(
        { ok: false, error: "Aucun message reçu." },
        { status: 400 }
      );
    }

    // Score each rule by number of matched keywords (longest match wins)
    let best: Rule | null = null;
    let bestScore = 0;
    for (const rule of RULES) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (question.includes(normalize(kw))) score += normalize(kw).length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = rule;
      }
    }

    const reply = best ? best.reply() : FALLBACK();
    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: `Désolé, je ne peux pas répondre pour le moment. N'hésitez pas à appeler la pharmacie au ${PHONE}.`,
      },
      { status: 500 }
    );
  }
}
