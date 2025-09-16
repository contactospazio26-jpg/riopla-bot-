import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(bodyParser.json());

// Cliente OpenAI con la API key desde Vercel
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("🚀 Servidor iniciado en Vercel, escuchando /webhook");

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    console.log("👉 Entró al endpoint /webhook");

    const userMessage = req.body?.message || "Hola";
    console.log("📩 Mensaje recibido:", userMessage);

    // Llamada al modelo GPT
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // podés cambiar a gpt-4o o gpt-3.5-turbo si querés probar
      messages: [
        { role: "system", content: "Sos Agus, promotora de bienestar de SkinCare 💖. Respondé cálida y profesionalmente." },
        { role: "user", content: userMessage }
      ],
      max_tokens: 100,
      temperature: 0.8
    });

    console.log("📝 Respuesta completa de OpenAI:", JSON.stringify(completion, null, 2));

    const reply = completion.choices[0]?.message?.content || "Disculpa, no entendí.";
    console.log("✅ Texto final enviado al cliente:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ reply: "Ocurrió un error, intenta más tarde 💔" });
  }
});

export default app;
