import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import IORedis from 'ioredis';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" } // Allow all origins for simplicity; adjust in production!
});

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const redisSub = new IORedis({ host: REDIS_HOST, port: 6379 });

// Listen for logs coming from the Executor
redisSub.subscribe('job-logs', (err) => {
  if (err) console.error("Failed to subscribe:", err);
  else console.log("📡 Subscribed to job-logs channel");
});

redisSub.on('message', (channel, message) => {
  if (channel === 'job-logs') {
    const data = JSON.parse(message);
    // Send specifically to the user interested in this jobId
    io.to(`job-${data.jobId}`).emit(`job-${data.jobId}`, data.log);
  }
});

io.on('connection', (socket) => {
  // Allow the frontend to join a specific job room
  socket.on('join-job', (jobId) => {
    socket.join(`job-${jobId}`);
    console.log(`👤 Client ${socket.id} joined room: job-${jobId}`);
  });
});

httpServer.listen(4000, () => {
  console.log('🛰️ Socket Service running on port 4000');
});