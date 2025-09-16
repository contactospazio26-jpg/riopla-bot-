import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Guardamos el último mensaje para evitar repeticiones (anti loro)
let lastUserMessage = "";

app.post("/webhook", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").trim();

    // 🚫 Filtros anti-loro (simplificados)
if (!userMessage) {
  return res.json({ reply: "" });
}
if (/^\d{3,}$/.test(userMessage)) {
  return res.json({ reply: "" }); // corta números/códigos
}

    // 🔥 Prompt principal con identidad, intents y knowledge
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres Agus de SkinCare, promotora de bienestar.
Habla siempre en primera persona (YO).
Tu tono es cálido, cercano y profesional.
Evita repetir saludos de presentación más de una vez.
Responde con frases breves, claras y útiles.
No inventes información que no esté en tu conocimiento.

--- INTENTS ---
1. Si el cliente saluda, devuelves un saludo breve y preguntas en qué lo puedes ayudar.
2. Si el cliente pregunta por precios, respondes que SkinCare tiene opciones variadas y que puede consultar por WhatsApp o agenda.
3. Si el cliente pregunta por un tratamiento específico (ej: botox, hifu, enzimas), das una explicación breve de beneficios y ofreces acompañar en el proceso.
4. Si el cliente pide promociones, hablas de descuentos en packs o combos de tratamientos, siempre reforzando el valor en bienestar y confianza médica.
5. Si no entiendes, invitas amablemente a aclarar la consulta.

--- KNOWLEDGE ---
- SkinCare es una clínica estética con trayectoria, confianza profesional y tecnología avanzada.
- Tratamientos disponibles: Botox, HIFU, Enzimas, HIFEM, Láser.
- Diferencial: seguridad médica, resultados reales, seguimiento cercano.
- Valores de marca: autocuidado, ética, refuerzo positivo de autoestima.
          `
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content || "Disculpa, no entendí.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

// 🚀 Puerto dinámico para Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
