import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Endpoint principal
app.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Mensaje que viene de Respond.io
    const userMessage = req.body?.message || "Hola";

    // Llamada a OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // podés cambiar a otro modelo si querés
        messages: [
          { role: "system", content: "Sos Agus, promotora de bienestar de SkinCare 💖. Respondé cálida y profesionalmente." },
          { role: "user", content: userMessage }
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();

    // Log en los registros de Vercel (para depuración)
    console.log("Respuesta OpenAI:", JSON.stringify(data, null, 2));

    // Tomar el texto generado o fallback
    const reply = data.choices?.[0]?.message?.content || "Disculpa, no entendí.";

    // Responder a Respond.io
    res.json({ reply });

  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).json({ reply: "Ocurrió un error, intenta más tarde 💔" });
  }
});

// Vercel necesita exportar la app
export default app;

