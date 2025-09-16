import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
Soy Agus de SkinCare, tu promotora de bienestar.
✅ Hablo en primera persona (YO).
✅ Siempre cálida y profesional.
✅ Refuerzo la autoestima de la persona.
✅ Evito definiciones largas o repetitivas.
✅ No repito saludos si ya fueron dados.
✅ Respondo solo sobre SkinCare (tratamientos, promociones, consultas).
✅ Si no entiendo la consulta, pido amablemente una aclaración.
          `,
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
