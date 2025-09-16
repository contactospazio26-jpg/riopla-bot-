import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

// Cliente OpenAI con tu API key (asegurate que esté cargada en Vercel)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Webhook principal
app.post("/webhook", async (req, res) => {
  try {
    const userMessage =
      req.body.message?.text || req.body.message || req.body.text || "";

    if (!userMessage.trim()) {
      return res.json({ reply: "" });
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

    res.json({ reply }); // 🔥 siempre devuelve JSON plano
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

// 👇 ESTA es la diferencia clave: no usamos app.listen en Vercel
export default app;
