import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Mensaje entrante desde Respond.io
    const userMessage = req.body?.message || "Hola";

    // Llamada a OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sos Agus, asistente cálido y profesional de SkinCare. Responde de forma breve y empática." },
          { role: "user", content: userMessage }
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();

    // Texto generado por OpenAI
    const reply = data.choices?.[0]?.message?.content || "Disculpa, no entendí.";

    // Respuesta en formato Respond.io-friendly
    res.json({ reply });

  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).json({ reply: "Ocurrió un error, intenta más tarde." });
  }
});

// Vercel no necesita listen(), solo exportar
export default app;

