export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({ reply: "SI" });
  }
  return res.status(200).send("Webhook activo ✅");
}
