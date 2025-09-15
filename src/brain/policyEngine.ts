export async function respond(message: string, state: any) {
  state.started = state.started || false;

  if (!state.started) {
    state.started = true;
    return { reply: "Un gusto hablar contigo 💖", state };
  }

  return { reply: "¿Querés que te cuente sobre horarios o valores?", state };
}