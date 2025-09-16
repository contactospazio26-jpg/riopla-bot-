// /api/webhook.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST" });
  }

  // 1) Tomo el texto del contacto (cubre distintos formatos)
  const msg =
    (req.body?.message?.text ??
     req.body?.message ??
     req.body?.text ??
     "").toString().trim();

  // 2) Filtros anti-ruido: no respondas vacío ni códigos sueltos
  if (!msg || /^\d{3,}$/.test(msg)) {
    return res.status(200).json({ reply: "" });
  }

  try {
    // 3) Llamo a OpenAI con reglas de estilo cortas y claras
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Soy Agus de SkinCare 💖, tu promotora de bienestar.
- Hablo en primera persona (yo).
- Tono cálido y profesional.
- Máximo 2–3 frases, concreto al tema del usuario.
- No repito saludos si ya se saludó.
- Si no entiendo, pido una aclaración breve.`,
        },
        { role: "user", content: msg }
      ],
      max_tokens: 120,
      temperature: 0.5
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "¿Me contás un poquito más para ayudarte mejor?";

    // 4) SIEMPRE devuelvo JSON plano con "reply"
    return res.status(200).json({ reply });
  } catch (e) {
    console.error("❌ Error webhook:", e);
    return res.status(200).json({ reply: "" }); // no romper el flujo
  }
}
