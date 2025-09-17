
// api/webhook.js
export default function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body || {};
    let reply = "Soy Yo, Mia de SkinCare 🌸?";

    if (message && message.toLowerCase().includes("piel")) {
      reply = "Quero saber todo de vos, cuentame todo y un poco más 💆‍♀️.";
    }

    return res.status(200).json({ reply });
  }

  return res.status(200).send("Webhook activo ✅");
}
