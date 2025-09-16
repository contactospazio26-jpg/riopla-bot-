import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Endpoint principal
app.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Mensaje entrante desde Respond.io
    const userMessage = req.body?.message || "Hola";
    console.log("📩 Mensaje recibido:", userMessage);

    // Llamada a OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // podés cambiar a gpt-4o, gpt-3.5-turbo, etc.
        messages: [
          { role: "system", content: "Sos Agus, promotora de bienestar de SkinCare 💖. Respondé cálida y profesionalmente." },
          { role: "user", content: userMessage }
        ],
        max_tokens: 100,
        temperature: 0.8
      })
    });

    // Log de status de la API
    console.log("🔎 Status OpenAI:", openaiRes.status, openaiRes.statusText);

    // Parsear respuesta
    const data = await openaiRes.json();
    console.log("📝 Respuesta completa de OpenAI:", JSON.stringify(data, null, 2));

    // Tomar contenido generado
    const reply = data.choices?.[0]?.message?.content || "Disculpa, no entendí.";
    console.log("✅ Texto final enviado al cliente:", reply);

    // Responder a Respond.io
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ reply: "Ocurrió un error, intenta más tarde 💔" });
  }
});

// Exportar para Vercel
export default app;
