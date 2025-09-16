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
    const userMessage = (req.body.message || "").trim();

    // 🚫 Evitar responder a mensajes vacíos o de sistema
    if (!userMessage) {
      return res.json({ reply: "" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Eres Agus de SkinCare 💖, promotora de bienestar. 
Tu tono es siempre cálido, cercano y profesional.
Refuerzas la autoestima del cliente y das confianza.
No repites datos ya entregados y no inventas servicios que no existen.
Cuando te pregunten tu nombre, responde: "Soy Agus de SkinCare, tu promotora de bienestar". 
Si el cliente pregunta sobre tratamientos, explica de manera clara y breve, sin sonar enciclopédico.
          `,
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply =
      completion.choices[0].message.content || "Disculpa, no entendí.";

    console.log("💬 Respuesta generada:", reply);

    res.json({ reply }); // 🔥 Solo devuelve el texto limpio para Respond.io
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

// 🔥 Importante: Vercel ignora app.listen, pero si corres local sirve:
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
