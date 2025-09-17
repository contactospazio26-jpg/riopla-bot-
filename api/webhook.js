// api/webhook.js
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body || {};
  return res.status(200).json({ reply: `Recibido: ${message}` });
};
