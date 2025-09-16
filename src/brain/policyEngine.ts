import policy from '../../prompt/policy.json' assert { type: 'json' };

export async function respond(message: string, state: any) {
  // Aseguramos que siempre exista el objeto state
  state.contact = state.contact || {};

  // --- Paso 1: si nunca empezó ---
  if (!state.started) {
    state.started = true;
    return { reply: policy.openings.warm_reception, state };
  }

  // --- Paso 2: pedir nombre si falta ---
  if (!state.contact.name) {
    // Guardar el nombre si parece que lo dio
    if (/\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/.test(message)) {
      state.contact.name = message.trim();
    } else {
      return { reply: policy.openings.name_confirmation_hint, state };
    }
  }

  // --- Paso 3: pedir WhatsApp si falta ---
  if (!state.contact.whatsapp) {
    const phone = message.match(/\+?\d{7,15}/);
    if (phone) {
      state.contact.whatsapp = phone[0];
    } else {
      return { reply: policy.openings.whatsapp_request, state };
    }
  }

  // --- Paso 4: preguntar por piel/cuerpo ---
  if (!state.dataAsked) {
    state.dataAsked = true;
    return { reply: policy.openings.interest_probe, state };
  }

  // --- Paso 5: si ya tiene datos, ofrecer horarios ---
  if (!state.offered) {
    state.offered = true;
    const opts = policy.scheduling.logic.offer_before_14;
    return { reply: `Tengo disponible ${opts.join(" o ")}. ¿Cuál preferís?`, state };
  }

  // --- Paso 6: cierre ---
  return { reply: "Gracias 💖 quedamos en contacto.", state };
}
