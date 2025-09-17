export default async function handler(req, res) {
  try {
    res.status(200).json({
      reply: "Soy Agus de SkinCare 🌸, ¿cómo puedo ayudarte?"
    });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    res.status(500).json({ error: "Fallo interno" });
  }
}
