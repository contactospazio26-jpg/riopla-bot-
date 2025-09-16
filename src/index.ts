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
    const userMessage = req.body.message || "Hola";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres Agus de SkinCare, promotora de bienestar, cálida y profesional." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content || "Disculpa, no entendí.";

    res.json({ reply }); // 🔥 solo devuelve el texto limpio
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error procesando el webhook" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
