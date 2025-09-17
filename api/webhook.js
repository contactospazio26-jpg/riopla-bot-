
// api/webhook.js
export default function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body || {};
    let reply = "Soy Agus de SkinCare 🌸, ¿cómo puedo ayudarte?";

    if (message && message.toLowerCase().includes("piel")) {
      reply = "Para cuidar tu piel necesito saber si es grasa, seca, mixta o sensible 💆‍♀️.";
    }

    return res.status(200).json({ reply });
  }

  return res.status(200).send("Webhook activo ✅");
}
