import express from 'express';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const app = express();
app.use(express.json());

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
};

const connection = new IORedis(REDIS_CONFIG);

// Initialize the "code-queue"
const codeQueue = new Queue('code-queue', { connection });

app.post('/submit', async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Missing language or code' });
  }

  try {
    // Add job to the queue
    const job = await codeQueue.add('execute-code', {
      language,
      code,
      submittedAt: new Date().toISOString(),
    });

    console.log(`[Submission-Service] Job ${job.id} queued successfully.`);
    
    res.status(202).json({ 
      message: 'Job queued', 
      jobId: job.id 
    });
  } catch (error) {
    console.error('[Submission-Service] Error:', error);
    res.status(500).json({ error: 'Failed to queue job' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Submission Service running on port ${PORT}`);
});