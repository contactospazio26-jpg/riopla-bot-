import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    return res.status(200).json({ reply: "SI" });
  }
  return res.status(200).send("Webhook activo ✅");
}
