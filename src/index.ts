import express from 'express';
import { respond } from './brain/policyEngine.js';

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const { message, state } = req.body || {};
  const replyObj = await respond(message, state || {});
  res.json(replyObj); // devuelve {reply, state}
});

app.get('/health', (_req, res) => res.send('ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on :${port}`));
