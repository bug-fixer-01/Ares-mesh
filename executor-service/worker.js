import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import Docker from 'dockerode';

const docker = new Docker(); // Connects to /var/run/docker.sock
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

async function ensureImage(imageName) {
  const images = await docker.listImages();
  const exists = images.some(img => img.RepoTags && img.RepoTags.includes(imageName));

  if (!exists) {
    console.log(`[Executor] Image ${imageName} not found. Pulling...`);
    // This returns a stream; we wrap it in a promise to wait until it's done
    return new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, onFinished, onProgress);
        function onFinished(err) { if (err) reject(err); else resolve(); }
        function onProgress(event) { console.log(`[Pulling ${imageName}]: ${event.status}`); }
      });
    });
  }
}

const connection = new IORedis({
  host: REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker('code-queue', async (job) => {
  const { language, code } = job.data;
  console.log(`[Executor] Sandboxing ${language} job: ${job.id}`);

  // Define image based on language
  const image = language === 'javascript' ? 'node:18-alpine' : 'python:3.10-alpine';
  const cmd = language === 'javascript' ? ['node', '-e', code] : ['python3', '-c', code];

  const redisPub = new IORedis({ host: REDIS_HOST, port: 6379 });


  try {
    await ensureImage(image);
    // 1. Create the container
    const container = await docker.createContainer({
      Image: image,
      Cmd: cmd,
      HostConfig: {
        Memory: 128 * 1024 * 1024, // Limit to 128MB (Security!)
        NanoCPUs: 500000000,      // Limit to 0.5 CPU cores
      },
      AttachStdout: true,
      AttachStderr: true,
    });

    // 2. Start the container
    await container.start();

      // Inside the worker loop...
  const stream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true
  });

  stream.on('data', (chunk) => {
    const log = chunk.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    // Shout the log to Redis
    redisPub.publish('job-logs', JSON.stringify({
      jobId: job.id,
      log: log
    }));
  });

    // 3. Wait for execution and set a timeout (Safety!)
    const waitPromise = container.wait();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Execution Timeout')), 10000)
    );

    await Promise.race([waitPromise, timeoutPromise]);

    // 4. Capture logs
    const logs = await container.logs({ stdout: true, stderr: true });
    const output = logs.toString().replace(/[\x00-\x1F\x7F-\x9F]/g, ""); // Clean Docker stream headers

    // 5. Cleanup
    await container.remove();

    return { output, status: 'success' };

  } catch (error) {
    console.error(`[Executor] Error in job ${job.id}:`, error.message);
    return { output: error.message, status: 'failed' };
  }
}, { connection });

worker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} output: \n${result.output}`);
});