import { NextRequest, NextResponse } from "next/server";
import ZAI, { ChatMessage } from "z-ai-web-dev-sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de la Pharmacie Aeria, une pharmacie de proximité située à Aeria Mall, Casablanca, Maroc.

RÔLE:
- Tu accueilles chaleureusement les visiteurs du site web.
- Tu réponds en français, de manière brève, claire et bienveillante.
- Tu orientes les clients vers les services de la pharmacie : conseil pharmaceutique, produits de santé, parapharmacie, hygiène & soins, bien-être.

INFORMATIONS SUR LA PHARMACIE:
- Nom : Pharmacie Aeria
- Adresse : Aeria Mall, Casablanca 20000, Maroc
- Téléphone : 05 29 12 23 23
- Services : conseil pharmaceutique, produits de santé, parapharmacie, hygiène & soins, bien-être

RÈGLES IMPORTANTES:
- Tes conseils sont généraux et ne remplacent jamais l'avis d'un professionnel de santé.
- Si une question médicale précise est posée, invite la personne à consulter un pharmacien ou un médecin.
- Tu ne prescris pas de médicaments, ne fais pas de diagnostics, et ne donnes pas de posologies précises.
- Si tu ne connais pas une information (horaires, stocks, produits spécifiques), invite la personne à appeler la pharmacie au 05 29 12 23 23 ou à utiliser le formulaire de contact.
- Reste concis : 2 à 4 phrases maximum par réponse.
- Termine souvent par une invitation à passer en pharmacie ou à appeler.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Aucun message reçu." },
        { status: 400 }
      );
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...messages.slice(-8), // keep last 8 messages for context
    ];

    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages: fullMessages,
      stream: false,
      thinking: { type: "disabled" },
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Réponse vide");
    }

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json(
      {
        ok: false,
        error: "Désolé, je ne peux pas répondre pour le moment. N'hésitez pas à appeler la pharmacie au 05 29 12 23 23.",
        debug: msg,
      },
      { status: 500 }
    );
  }
}
