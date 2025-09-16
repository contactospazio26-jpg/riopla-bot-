import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// cargar policy.json
const policyPath = path.resolve("prompt/policy.json");
const policy = JSON.parse(fs.readFileSync(policyPath, "utf-8"));

export async function respond(message: string, state: any) {
  state = state || {};

  // prompt base con tu policy
  const systemPrompt = `
Sos un asistente de SkinCare.
Usá estas reglas de estilo y comportamiento (JSON):
${JSON.stringify(policy, null, 2)}
Responde en primera persona, tono íntimo y cercano.
`;

  // llamada a OpenAI
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // podés cambiar a otro modelo
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0]?.message?.content || "";

  return { reply, state };
}
