import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import journalRoutes from './routes/journal.routes';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import insightsRoutes from './routes/insights.routes';
import agentRoutes from './routes/agent.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/agent', agentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server up: port ${PORT}`);
});
