# EG Auth Server

The backend authentication service for EasyGenerator, built with NestJS.

## Features

- **Authentication**: JWT-based authentication using HttpOnly cookies.
- **Security**: 
  - CSRF protection (csrf-csrf w/ cookie-parser)
  - Password hashing (Argon2)
  - CORS configuration
- **Database**: Prisma ORM with MongoDB.
- **Documentation**: Swagger/OpenAPI auto-generated documentation.

## Prerequisites

- Node.js (v20+)
- pnpm
- MongoDB (running locally or via Docker)

## Installation

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb://localhost:27017/eg_auth?replicaSet=rs0&directConnection=true"
JWT_SECRET="super-secret-jwt-key"
CSRF_SECRET="super-secret-csrf-key"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

## Running the app

```bash
# development
pnpm run start:dev

# production mode
pnpm run start:prod
```

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

This documentation details all available endpoints, request bodies, and authentication methods.

## Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e
```
