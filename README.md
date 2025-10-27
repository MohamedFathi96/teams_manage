# Chatty - Real-time Chat Application

A modern real-time chat application built with React, Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start with Docker

The easiest way to run the entire application is using Docker Compose:

```bash
# Start all services (frontend, backend, and MongoDB)
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

For detailed Docker instructions, see [DOCKER_README.md](./DOCKER_README.md).

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript + JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Docker + Docker Compose

## 📦 Services

### Frontend (Port 3000)

- Modern React application with TypeScript
- Tailwind CSS for styling
- Nginx for production serving
- Hot reloading in development

### Backend (Port 5000)

- RESTful API with Express.js
- JWT-based authentication
- MongoDB integration
- TypeScript for type safety
- Comprehensive error handling

### MongoDB (Port 27017)

- MongoDB 7.0 with persistent storage
- Pre-configured with authentication
- Data persistence through Docker volumes

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- MongoDB (or use Docker)
- pnpm (recommended) or npm

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chatty
   ```

2. **Backend Setup**

   ```bash
   cd backend
   pnpm install
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   pnpm dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

4. **MongoDB Setup**
   - Install MongoDB locally, or
   - Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:7.0`

## 🐳 Docker Commands

We provide a convenient script for Docker operations:

```bash
# Make script executable (Linux/Mac)
chmod +x docker-scripts.sh

# Start application
./docker-scripts.sh start

# Stop application
./docker-scripts.sh stop

# View logs
./docker-scripts.sh logs

# Check status
./docker-scripts.sh status

# Rebuild and restart
./docker-scripts.sh rebuild

# Backup MongoDB
./docker-scripts.sh backup

# Clean up everything
./docker-scripts.sh cleanup
```

## 📁 Project Structure

```
chatty/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   └── assets/          # Static assets
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml       # Multi-service orchestration
├── docker-scripts.sh        # Docker management script
└── DOCKER_README.md         # Detailed Docker documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatty
JWT_SECRET=your-super-secret-jwt-key-minimum-16-characters
JWT_EXPIRES_IN=604800
```

### Docker Environment

The Docker Compose setup includes:

- **Custom network** for service communication
- **Named volumes** for MongoDB data persistence
- **Health checks** for service monitoring
- **Production-optimized** builds

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** in `docker-compose.yml`
2. **Change default passwords** for MongoDB
3. **Use strong JWT secrets**
4. **Configure reverse proxy** (Nginx/Traefik) for HTTPS
5. **Set up monitoring** and logging

### Security Considerations

- Change default MongoDB credentials
- Use environment-specific JWT secrets
- Implement rate limiting
- Configure CORS properly
- Use HTTPS in production
- Regular security updates

## 📊 Monitoring

### Health Checks

- Backend: `GET /api/health`
- Frontend: Available at `http://localhost:3000`
- MongoDB: Connection test via backend

### Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For detailed Docker setup and troubleshooting, see [DOCKER_README.md](./DOCKER_README.md).

For issues and questions, please create an issue in the repository.
