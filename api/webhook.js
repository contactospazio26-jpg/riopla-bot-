// api/webhook.js
export default function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;
    const message = body?.message || "mensaje vacío";

    res.status(200).json({
      reply: `Recibí tu mensaje: ${message}`
    });
  } else {
    res.status(200).send("Webhook activo ✅");
  }
}
