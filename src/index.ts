import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST permitido" });
  }

  try {
    const userMessage =
      req.body.message?.text || req.body.message || req.body.text || "";

    if (!userMessage.trim()) {
      return res.status(200).json({ reply: "" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres Agus de SkinCare, promotora de bienestar.
Habla en primera persona (YO), tono cálido y profesional.
No repitas saludos si ya fueron dados.
Responde breve, claro y directo.
          `,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content || "Disculpa, no entendí.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return res.status(500).json({ error: "Error procesando el webhook" });
  }
}
