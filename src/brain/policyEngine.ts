import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function respond(message: string, state: any) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Sos un bot amistoso de SkinCare 💖" },
      { role: "user", content: message }
    ],
  });

  const reply = completion.choices[0]?.message?.content || "Error 💔";
  return { reply, state };
}
