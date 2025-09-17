export default async function handler(req, res) {
  try {
    const { message } = req.body || {};
    const reply = message 
      ? `Recibí tu mensaje: ${message}. Soy Agus de SkinCare 🌸`
      : "Soy Agus de SkinCare 🌸, ¿cómo puedo ayudarte?";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).json({ error: "Fallo interno" });
  }
}
