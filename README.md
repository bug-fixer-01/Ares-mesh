# ARES-MESH // Distributed Code Execution Engine

A high-performance, microservices-based system designed to execute untrusted code in isolated, resource-constrained environments.

## 🚀 Key Features
- **Isolated Execution**: Uses Docker containers to sandbox code, preventing host system access.
- **Resource Limiting**: Strict memory (128MB) and CPU (0.5 cores) quotas via Dockerode.
- **Real-time Streaming**: Redis Pub/Sub and Socket.io stream execution logs live to the UI.
- **Asynchronous Architecture**: BullMQ and Redis manage a distributed job queue to handle high concurrency.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), XTerm.js, Monaco Editor, Tailwind CSS.
- **Backend**: Node.js (ES6), Express, Socket.io.
- **Infrastructure**: Redis, Docker, Docker-Compose.

## 🏗️ Architecture
[Insert the Architecture Diagram here once you generate it]

## 🚦 Getting Started
1. Ensure Docker is running.
2. Clone the repo.
3. Run \`docker-compose up\`.
4. Access the dashboard at \`http://localhost:5173\`.