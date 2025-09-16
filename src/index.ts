import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 👈 clave desde Vercel
});

app.post("/webhook", async (req, res) => {
  try {
    // 👀 Logs para ver qué llega desde Respond.io
    console.log("📩 Body recibido:", JSON.stringify(req.body, null, 2));

    // Toma el campo "message" si existe, si no, usa "Hola"
    const userMessage = req.body.message || "Hola";
    console.log("📩 Mensaje procesado:", userMessage);

    // Llamada a OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Soy Agus de SkinCare 🌸, promotora de bienestar. Respondo siempre en primera persona, de forma cálida, cercana y profesional.",
        },
        { role: "user", content: userMessage },
      ],
    });

    // Respuesta generada
    const reply = completion.choices[0].message?.content?.trim() || "Disculpa, no entendí.";

    // 👀 Log de lo que se devuelve
    console.log("🤖 Respuesta enviada:", reply);

    // Devuelve JSON simple
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

// Export para Vercel (no usar app.listen)
export default app;
