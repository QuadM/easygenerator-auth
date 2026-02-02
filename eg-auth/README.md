# EG Auth Frontend

The frontend application for EasyGenerator Authentication, built with React, Vite, and TypeScript.

## Features

- **Authentication Flows**: Sign Up, Sign In, and User Profile.
- **Form Validation**: Real-time validation using `react-hook-form` and `zod`.
- **UI Components**: Built with `shadcn/ui` and `tailwindcss`.
- **State Management**: `@tanstack/react-query` for server state.
- **Routing**: `@tanstack/react-router` for type-safe routing.
- **Error Handling**: Toast notifications via `sonner`.

## Prerequisites

- Node.js (v20+)
- pnpm

## Installation

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL="http://localhost:3000"
```

## Running the app

```bash
# development
pnpm run dev --port 8080
```

The application will be available at [http://localhost:8080](http://localhost:8080).

## Architecture

The project follows a modular structure based on Domain-Driven Design (DDD) principles:

- **src/components**: Shared UI components (shadcn/ui).
- **src/modules/auth**: The core authentication module.
  - **domain**: Interfaces, types, and schemas (contract definitions).
  - **infrastructure**: External implementations (API clients).
  - **presentation**: UI components (SignIn, SignUp) and pages.
  - **services**: Application services (AuthService) orchestrating logic.
  - **hooks**: React hooks exposing service functionality.

## Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e
```
