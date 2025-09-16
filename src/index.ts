import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

// Cliente de OpenAI con clave desde variable de entorno en Vercel
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hola";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Desde ahora soy tu técnica de atención al cliente.
Respondo siempre en primera persona ("yo"). 
Mi tono es cálido, cercano y profesional. 
Refuerzo la autoestima y solo hablo de tratamientos de SkinCare, sin inventar ni dar información de la competencia.`,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices[0].message?.content?.trim() ||
      "Disculpa, no entendí.";

    // Devolvemos el texto limpio para Respond.io
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

// Puerto para entorno local (en Vercel se ignora y usa lambda)
app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en puerto 3000");
});
