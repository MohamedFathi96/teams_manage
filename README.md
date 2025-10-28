# Teams Manage - Task Management Application

A modern task management application built with React, Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start

### Using pnpm (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd teams_manage
   ```

2. **Start MongoDB**

   ```bash
   # Using Docker (recommended)
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or install MongoDB locally
   ```

3. **Backend Setup**

   ```bash
   cd backend
   pnpm install
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   pnpm run dev
   ```

4. **Frontend Setup** (in a new terminal)

   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ✨ Features

- **Task Management**: Create, read, update, and delete tasks
- **User Authentication**: JWT-based secure authentication & Refresh Tokens
- **Task Assignment**: Assign tasks to team members
- **Status Tracking**: Track task progress (Pending, In Progress, Completed, Cancelled)
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data loading with pagination
- **Real-time Updates**: Live task updates and statistics
- **Responsive Design**: Modern UI that works on all devices

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + TanStack Router + React Query + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **UI Components**: shadcn/ui + Radix UI
- **Package Manager**: pnpm

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (install with `npm install -g pnpm`)
- MongoDB (or use Docker)

### Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teams_manage
JWT_SECRET=your-super-secret-jwt-key-minimum-16-characters
JWT_EXPIRES_IN=604800
```

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Tasks

- `GET /api/tasks` - Get tasks with pagination and filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/all` - Get task statistics

### Users

- `GET /api/users` - Get all users (for task assignment)

## 📁 Project Structure

```
teams_manage/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers (auth, tasks, users)
│   │   ├── models/          # MongoDB models (User, Task)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-based modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── tasks/       # Task management
│   │   │   └── users/       # User management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configurations
│   │   ├── routes/          # TanStack Router routes
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```

## 🎯 Usage

### Creating Tasks

1. Register/Login to the application
2. Navigate to the Tasks page
3. Click "Create Task" button
4. Fill in task details and assign to a user
5. Save the task

### Managing Tasks

- **View Tasks**: Browse all tasks with pagination
- **Filter Tasks**: Filter by status, search by title/description
- **Sort Tasks**: Sort by creation date, title, or status
- **Edit Tasks**: Update task details and status
- **Delete Tasks**: Remove tasks (only creators can delete)

### Task Status Flow

```
Pending → In Progress → Completed
    ↓         ↓
Cancelled ← Cancelled
```

## 🚀 Scripts

### Backend

```bash
cd backend
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run ESLint
```

### Frontend

```bash
cd frontend
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please create an issue in the repository.
