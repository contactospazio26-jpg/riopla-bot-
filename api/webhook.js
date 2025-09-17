// api/webhook.js
export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({ reply: "ok ✅" });
  }
  return res.status(200).send("Webhook activo simple");
}
