# EasyGenerator Authentication System

A full-stack authentication system with JWT-based authentication, CSRF protection, and modern security practices. Built with NestJS (backend) and React + Vite (frontend).

## 🏗️ Architecture

```
easygenerator/
├── eg-auth-server/     # NestJS backend API
├── eg-auth/            # React + Vite frontend
└── docker-compose.yml  # Docker orchestration
```

### Backend (`eg-auth-server`)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT tokens in HttpOnly cookies
- **Security**: CSRF protection, Argon2 password hashing, CORS
- **API Docs**: Swagger/OpenAPI at `/api/docs`

### Frontend (`eg-auth`)
- **Framework**: React 18 + Vite + TypeScript
- **Routing**: TanStack Router (type-safe)
- **State**: TanStack Query for server state
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: react-hook-form + Zod validation
- **Architecture**: Domain-Driven Design (DDD)

## 🚀 Quick Start with Docker

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/QuadM/easygenerator-auth.git
cd easygenerator
```

### 2. Start All Services
```bash
docker-compose up --build
```

This will start:
- **MongoDB** (replica set) on `localhost:27017`
- **Backend API** on `http://localhost:3000`
- **Frontend App** on `http://localhost:8080`

### 3. Access the Application
- **Frontend**: http://localhost:8080
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000

### 4. Stop Services
```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## 🛠️ Local Development (without Docker)

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB (with replica set)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd eg-auth-server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create `.env` file**
   ```env
   DATABASE_URL="mongodb://localhost:27017/eg_auth?replicaSet=rs0&directConnection=true"
   JWT_SECRET="your-super-secret-jwt-key"
   CSRF_SECRET="your-super-secret-csrf-key"
   FRONTEND_URL="http://localhost:8080"
   PORT=3000
   NODE_ENV="development"
   ```

4. **Generate Prisma Client**
   ```bash
   pnpm prisma:generate
   ```

5. **Push database schema**
   ```bash
   pnpm prisma:db:push
   ```

6. **Start development server**
   ```bash
   pnpm start:dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd eg-auth
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

4. **Start development server**
   ```bash
   pnpm dev --port 8080
   ```

## 🧪 Testing

### Backend Tests
```bash
cd eg-auth-server

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Frontend Tests
```bash
cd eg-auth

# Unit tests
pnpm test

# E2E tests (Playwright)
pnpm test:e2e
```

## 📚 API Documentation

Once the backend is running, access the interactive Swagger documentation:

**http://localhost:3000/api/docs**

### Key Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user
- `GET /auth/profile` - Get current user (requires auth)
- `POST /auth/logout` - Logout user
- `GET /csrf/token` - Get CSRF token

## 🔐 Security Features

- **JWT Authentication**: Tokens stored in HttpOnly cookies (XSS protection)
- **CSRF Protection**: Double-submit cookie pattern with `csrf-csrf`
- **Password Hashing**: Argon2 (winner of Password Hashing Competition)
- **CORS**: Configured for frontend origin
- **Input Validation**: DTOs with class-validator
- **Security Headers**: Helmet middleware

## 🏗️ CI/CD

GitHub Actions workflows are configured for:

### Backend Pipeline (`.github/workflows/ci-backend.yml`)
- ✅ Linting (ESLint)
- ✅ Unit Tests (Jest)
- ✅ Build Check
- ✅ Security Audit (pnpm audit)
- 🐳 Docker Build & Push to GHCR

### Frontend Pipeline (`.github/workflows/ci-frontend.yml`)
- ✅ Linting (ESLint)
- ✅ Unit Tests (Vitest)
- ✅ Build Check
- 🐳 Docker Build & Push to GHCR

## 📁 Project Structure

### Backend (`eg-auth-server/src`)
```
src/
├── auth/              # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── users/             # User management
├── common/            # Shared utilities
│   ├── csrf.guard.ts
│   ├── csrf.service.ts
│   └── http-exception.filter.ts
├── prisma/            # Database client
└── main.ts            # Application entry
```

### Frontend (`eg-auth/src`)
```
src/
├── modules/auth/      # Auth module (DDD)
│   ├── domain/        # Interfaces & schemas
│   ├── infrastructure/# HTTP client
│   ├── presentation/  # UI components
│   ├── services/      # Business logic
│   └── hooks/         # React hooks
├── components/        # Shared UI (shadcn)
└── routes/            # TanStack Router
```

## 🔧 Environment Variables

### Backend (`eg-auth-server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `CSRF_SECRET` | Secret for CSRF tokens | - |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:8080` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

### Frontend (`eg-auth/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |


### MongoDB Connection Issues
Ensure MongoDB is running with replica set:
```bash
docker run -d --name mongo -p 27017:27017 mongo:6.0 --replSet rs0
docker exec -it mongo mongosh --eval "rs.initiate()"
```

### Port Already in Use
Change ports in `docker-compose.yml` or `.env` files if defaults conflict.

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

### Prisma Client Not Generated
Run `pnpm prisma:generate` in the backend directory.
