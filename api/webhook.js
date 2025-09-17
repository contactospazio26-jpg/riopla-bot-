// api/webhook.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body || {};

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Soy Agus de SkinCare 🌸, promotora de bienestar. Hablo en primera persona con calidez, cercanía y profesionalismo.",
        },
        { role: "user", content: message || "Hola" },
      ],
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    return res.status(500).json({ error: err.message });
  }
}
