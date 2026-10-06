import { NextRequest, NextResponse } from "next/server";
import { writeJsonSafe } from "@/lib/data-store";

export const runtime = "nodejs";

// When the bot cannot answer, save the question as a ticket for the admin panel.
// Best-effort: analytics must never break the chat.
async function saveTicket(question: string, lang: string) {
  try {
    await writeJsonSafe(
      "tickets.json",
      (cur: any[]) => {
        const list = Array.isArray(cur) ? cur : [];
        list.unshift({
          id: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          question: question.slice(0, 500),
          lang,
          date: new Date().toISOString(),
          status: "open",
        });
        // keep the 500 most recent tickets
        if (list.length > 500) list.length = 500;
        return list;
      },
      "chatbot: new unanswered question"
    );
  } catch {}
}

type Lang = "fr" | "en" | "ar";

const PHONE = "05 29 12 23 23";
const WHATSAPP = "06 00 18 30 78";
const ADDRESS_FR = "Aeria Mall, Casablanca 20000, Maroc";
const ADDRESS_EN = "Aeria Mall, Casablanca 20000, Morocco";
const ADDRESS_AR = "أيريا مول، الدار البيضاء 20000، المغرب";

type Rule = {
  fr: { kw: string[]; reply: () => string };
  en: { kw: string[]; reply: () => string };
  ar: { kw: string[]; reply: () => string };
};

const RULES: Rule[] = [
  {
    fr: {
      kw: ["urgence", "urgent", "emergency", "sos"],
      reply: () =>
        `En cas d'urgence, appelez directement la Pharmacie Aeria au ${PHONE} ou le 141 (SAMU). Nous sommes situés à ${ADDRESS_FR}.`,
    },
    en: {
      kw: ["emergency", "urgent", "sos"],
      reply: () =>
        `In an emergency, call Pharmacie Aeria directly at ${PHONE} or dial 141 (SAMU). We are located at ${ADDRESS_EN}.`,
    },
    ar: {
      kw: ["طارئ", "مستعجل", "إسعاف", "الاسعاف", "عاجل"],
      reply: () =>
        `في حالة الطوارئ، اتصل بصيدلية أيريا مباشرة على الرقم ${PHONE} أو اطلب 141 (الإسعاف). نحن موجودون في ${ADDRESS_AR}.`,
    },
  },
  {
    fr: {
      kw: ["horaires", "heure d'ouverture", "heures", "ouvert", "ouvre", "ferme", "fermé", "fermeture", "opening", "schedule", "وقت"],
      reply: () =>
        `Pour connaître nos horaires d'ouverture exacts, le plus sûr est d'appeler la pharmacie au ${PHONE}. Nous sommes situés à ${ADDRESS_FR}.`,
    },
    en: {
      kw: ["hours", "opening", "open", "close", "closing", "schedule", "when are you", "what time"],
      reply: () =>
        `For our exact opening hours, the safest way is to call the pharmacy at ${PHONE}. We are located at ${ADDRESS_EN}.`,
    },
    ar: {
      kw: ["أوقات", "توقيت", "ساعات العمل", "متى تفتحون", "متى تفتح", "مفتوح", "تفتح", "تغلق", "الدوام"],
      reply: () =>
        `لمعرفة أوقات العمل بدقة، الأفضل الاتصال بالصيدلية على الرقم ${PHONE}. نحن موجودون في ${ADDRESS_AR}.`,
    },
  },
  {
    fr: {
      kw: ["adresse", "localisation", "situe", "situé", "trouve", "ou se trouve", "itineraire", "itinéraire", "map", "plan", "mall", "emplacement", "location"],
      reply: () =>
        `La Pharmacie Aeria se trouve à ${ADDRESS_FR}, au sein de l'Aeria Mall. Passez nous voir, nous serons ravis de vous accueillir !`,
    },
    en: {
      kw: ["address", "location", "where", "find you", "located", "map", "directions", "mall", "how do i get"],
      reply: () =>
        `Pharmacie Aeria is located at ${ADDRESS_EN}, inside Aeria Mall. Come and see us — we'll be happy to welcome you!`,
    },
    ar: {
      kw: ["عنوان", "أين", "مكانكم", "موقع", "أين أنتم", "موقعكم", "توجدون", "كيف أوصل", "الوصول", "الخريطة"],
      reply: () =>
        `صيدلية أيريا توجد في ${ADDRESS_AR}، داخل أيريا مول. زورونا، سنكون سعداء باستقبالكم!`,
    },
  },
  {
    fr: {
      kw: ["telephone", "téléphone", "numero", "numéro", "appeler", "appel", "contact", "joindre", "phone", "call"],
      reply: () =>
        `Vous pouvez joindre la Pharmacie Aeria au ${PHONE} ou par WhatsApp au ${WHATSAPP}. N'hésitez pas à nous appeler pour toute question sur nos produits ou services.`,
    },
    en: {
      kw: ["phone", "number", "call", "contact", "reach you", "telephone"],
      reply: () =>
        `You can reach Pharmacie Aeria at ${PHONE} or on WhatsApp at ${WHATSAPP}. Feel free to contact us with any question about our products or services.`,
    },
    ar: {
      kw: ["رقم", "هاتف", "اتصال", "اتصل", "أتواصل", "كيف نتواصل"],
      reply: () =>
        `يمكنكم التواصل مع صيدلية أيريا على الرقم ${PHONE} أو عبر واتساب على الرقم ${WHATSAPP}. لا تترددوا في الاتصال بنا لأي سؤال حول منتجاتنا أو خدماتنا.`,
    },
  },  {
    fr: {
      kw: ["whatsapp", "wa.me", "message"],
      reply: () =>
        `Oui ! Vous pouvez nous écrire sur WhatsApp au ${WHATSAPP} : conseils, disponibilité d'un produit ou questions sur vos traitements.`,
    },
    en: {
      kw: ["whatsapp", "wa.me", "text you"],
      reply: () =>
        `Yes! You can message us on WhatsApp at ${WHATSAPP} for advice, product availability or any question about your treatments.`,
    },
    ar: {
      kw: ["واتساب", "whatsapp"],
      reply: () =>
        `نعم! يمكنكم مراسلتنا عبر واتساب على الرقم ${WHATSAPP} للاستشارة أو معرفة توفر منتج أو أي سؤال حول علاجاتكم.`,
    },
  },
  {
    fr: {
      kw: ["parapharmacie", "parapharma", "cosmetique", "cosmétique", "beaute", "beauté", "soin", "hygiene", "hygiène", "creme", "crème", "shampoing"],
      reply: () =>
        "Notre parapharmacie propose une large sélection de produits de beauté, d'hygiène et de soins : crèmes, shampoings, compléments alimentaires et bien plus. Passez en pharmacie pour découvrir la sélection, ou appelez-nous pour vérifier la disponibilité d'un produit.",
    },
    en: {
      kw: ["parapharmacy", "cosmetics", "beauty", "skincare", "cream", "shampoo", "hygiene", "care product", "supplement"],
      reply: () =>
        "Our parapharmacy offers a wide selection of beauty, hygiene and care products: creams, shampoos, supplements and more. Come by to browse the selection, or call us to check a product's availability.",
    },
    ar: {
      kw: ["بارافارماسي", "مستحضرات", "تجميل", "عناية بالبشرة", "كريم", "شامبو", "نظافة", "مكملات"],
      reply: () =>
        "تقدم البارافارماسي لدينا تشكيلة واسعة من منتجات التجميل والنظافة والعناية: كريمات، شامبوهات، مكملات غذائية والمزيد. زورونا لاكتشاف التشكيلة، أو اتصلوا بنا للتحقق من توفر منتج معين.",
    },
  },
  {
    fr: {
      kw: ["service", "conseil", "accompagnement", "professionnel"],
      reply: () =>
        "La Pharmacie Aeria vous accompagne avec : conseil pharmaceutique personnalisé, produits de santé, parapharmacie, hygiène & soins et bien-être. Notre équipe est là pour vous orienter au mieux.",
    },
    en: {
      kw: ["service", "advice", "guidance", "offer", "do you do"],
      reply: () =>
        "Pharmacie Aeria supports you with: personalized pharmaceutical advice, health products, parapharmacy, hygiene & care and well-being. Our team is here to point you in the right direction.",
    },
    ar: {
      kw: ["خدمات", "خدمة", "نصيحة", "استشارة", "استشارات"],
      reply: () =>
        "صيدلية أيريا ترافقكم بـ: استشارة صيدلانية شخصية، منتجات صحية، بارافارماسي، النظافة والعناية والعافية. فريقنا هنا لتوجيهكم في الاتجاه الصحيح.",
    },
  },
  {
    fr: {
      kw: ["ordonnance", "prescription", "medicament", "médicament", "traitement", "renouveler"],
      reply: () =>
        `Nous délivrons bien sûr les ordonnances et conseils associés. Apportez votre ordonnance en pharmacie, ou appelez-nous au ${PHONE} pour vérifier la disponibilité d'un médicament.`,
    },
    en: {
      kw: ["prescription", "medicine", "medication", "medicament", "treatment", "refill"],
      reply: () =>
        `Of course — we dispense prescriptions and the associated advice. Bring your prescription to the pharmacy, or call us at ${PHONE} to check a medication's availability.`,
    },
    ar: {
      kw: ["وصفة", "روشتة", "دواء", "أدوية", "علاج", "أعلاج", "تجديد"],
      reply: () =>
        `بالتأكيد — نصرف الوصفات الطبية مع الاستشارات اللازمة. أحضروا وصفتكم إلى الصيدلية، أو اتصلوا بنا على ${PHONE} للتحقق من توفر دواء معين.`,
    },
  },
  {
    fr: {
      kw: ["livraison", "domicile", "livrer", "delivery", "apporter"],
      reply: () =>
        `Pour toute demande de livraison à domicile, merci de nous appeler au ${PHONE} : nous vous indiquerons les modalités.`,
    },
    en: {
      kw: ["delivery", "home delivery", "deliver", "ship"],
      reply: () =>
        `For any home delivery request, please call us at ${PHONE} and we'll explain the arrangements.`,
    },
    ar: {
      kw: ["توصيل", "توصيل منزلي", "يوصله", "ت送达", "إلى المنزل"],
      reply: () =>
        `لأي طلب توصيل إلى المنزل، يرجى الاتصال بنا على ${PHONE} وسنوضح لكم التفاصيل.`,
    },
  },
  {
    fr: {
      kw: ["prix", "tarif", "cout", "coût", "combien", "cher", "price"],
      reply: () =>
        `Les prix varient selon les produits, le mieux est de nous appeler au ${PHONE} ou de passer en pharmacie pour obtenir le tarif exact.`,
    },
    en: {
      kw: ["price", "cost", "how much", "expensive", "fee"],
      reply: () =>
        `Prices vary by product — the best way is to call us at ${PHONE} or visit the pharmacy to get the exact price.`,
    },
    ar: {
      kw: ["سعر", "ثمن", "بشحال", "كم السعر", "السعر", "التمن", "غالي"],
      reply: () =>
        `الأسعار تختلف حسب المنتج — الأفضل الاتصال بنا على ${PHONE} أو زيارة الصيدلية لمعرفة السعر بدقة.`,
    },
  },
  {
    fr: {
      kw: ["stock", "disponible", "disponibilite", "disponibilité", "avoir"],
      reply: () =>
        `Pour vérifier la disponibilité d'un produit en stock, appelez-nous au ${PHONE} : nous vous répondrons immédiatement.`,
    },
    en: {
      kw: ["stock", "available", "availability", "do you have"],
      reply: () =>
        `To check a product's availability in stock, call us at ${PHONE} — we'll answer right away.`,
    },
    ar: {
      kw: ["توفر", "متوفر", "متوفر عندكم", "المخزون", "عندكم"],
      reply: () =>
        `للتحقق من توفر منتج في المخزون، اتصلوا بنا على ${PHONE} — سنرد عليكم فورا.`,
    },
  },
  {
    fr: {
      kw: ["bonjour", "bonsoir", "salut", "hello", "coucou", "salam", "salaam", "السلام", "مرحبا"],
      reply: () =>
        "Bonjour et bienvenue ! Je suis l'assistant de la Pharmacie Aeria. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services, produits, notre adresse ou comment nous contacter.",
    },
    en: {
      kw: ["hello", "hi", "hey", "good morning", "good evening", "salam"],
      reply: () =>
        "Hello and welcome! I'm the Pharmacie Aeria assistant. How can I help you today? I can answer questions about our services, products, our address, or how to contact us.",
    },
    ar: {
      kw: ["مرحبا", "السلام", "سلام", "اهلا", "أهلا", "صباح الخير", "مساء الخير"],
      reply: () =>
        "مرحبا بكم! أنا مساعد صيدلية أيريا. كيف يمكنني مساعدتكم اليوم؟ يمكنني الإجابة عن أسئلتكم حول خدماتنا ومنتجاتنا وعنواننا وطريقة التواصل معنا.",
    },
  },
  {
    fr: {
      kw: ["merci", "thanks", "شكرا"],
      reply: () =>
        "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Au plaisir de vous accueillir à l'Aeria Mall.",
    },
    en: {
      kw: ["thank", "thanks", "thx"],
      reply: () =>
        "You're welcome! Feel free to ask anything else. We look forward to welcoming you at Aeria Mall.",
    },
    ar: {
      kw: ["شكرا", "مشكور", "جزاكم"],
      reply: () =>
        "على الرحب والسعة! لا تترددوا في طرح أي سؤال آخر. نتطلع لاستقبالكم في أيريا مول.",
    },
  },
];

const FALLBACK: Record<Lang, () => string> = {
  fr: () =>
    `Je ne suis pas certain de bien comprendre votre demande. Je peux vous renseigner sur nos services, notre parapharmacie, notre adresse et comment nous contacter. Pour toute question précise, appelez-nous au ${PHONE} — nous serons ravis de vous aider.`,
  en: () =>
    `I'm not sure I understood your request. I can help with our services, parapharmacy, our address, and how to contact us. For anything specific, call us at ${PHONE} — we'll be glad to help.`,
  ar: () =>
    `لم أفهم طلبكم تماما. يمكنني مساعدتكم في معلومات حول خدماتنا، البارافارماسي، عنواننا وطريقة التواصل معنا. لأي سؤال دقيق، اتصلوا بنا على ${PHONE} — سنكون سعداء بمساعدتكم.`,
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const EN_MARKERS = [
  "the ", "what", "where", "when", "how", "your", "you", "are", "open", "hour",
  "price", "cost", "pharmacy", "hello", "hi ", "hi!", "thanks", "do you",
  "can i", "have", "sell", "buy", "need", "want", "where", "call", "phone",
  "address", "location", "delivery", "available", "medicine", "prescription",
  "service", "advice", "emergency",
];

function detectLang(text: string): Lang {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  const t = " " + normalize(text).replace(/[!?.,]/g, " ") + " ";
  let score = 0;
  for (const m of EN_MARKERS) {
    if (t.includes(" " + m.trim() + " ") || t.includes(" " + m)) score++;
  }
  return score >= 2 ? "en" : "fr";
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
    const rawQuestion = String(last?.content ?? "");
    const question = normalize(rawQuestion);

    if (!question) {
      return NextResponse.json(
        { ok: false, error: "Aucun message reçu." },
        { status: 400 }
      );
    }

    const lang: Lang = detectLang(rawQuestion);
    const langPack = (r: Rule) => r[lang];

    // Score each rule by matched keyword length (longest match wins)
    let best: Rule | null = null;
    let bestScore = 0;
    for (const rule of RULES) {
      let score = 0;
      for (const kw of langPack(rule).kw) {
        if (question.includes(normalize(kw))) score += normalize(kw).length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = rule;
      }
    }

    const reply = best ? langPack(best).reply() : FALLBACK[lang]();
    if (!best) await saveTicket(rawQuestion, lang);
    return NextResponse.json({ ok: true, reply, lang });
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
