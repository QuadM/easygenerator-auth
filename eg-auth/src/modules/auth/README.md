# Auth Module Architecture

This document explains the architecture of the auth module and how it follows **Domain-Driven Design (DDD)** and **SOLID principles**.

## 📁 Project Structure

```
src/modules/auth/
├── domain/              # Domain Layer (Business Logic & Rules)
│   ├── config.ts        # Configuration abstractions
│   ├── httpClient.ts    # HTTP client interface
│   ├── schemas.ts       # Validation schemas (business rules)
│   └── types.ts         # Domain entities (User, etc.)
│
├── infrastructure/      # Infrastructure Layer (External Dependencies)
│   ├── api.ts          # Legacy exports (deprecated)
│   └── axiosHttpClient.ts  # Axios-based HTTP client implementation
│
├── services/           # Application Layer (Use Cases)
│   └── authService.ts  # Auth service + React Query hooks
│
├── providers/          # React Providers
│   └── QueryProvider.tsx  # React Query provider setup
│
├── hooks/              # React Hooks (Presentation Layer Interface)
│   └── useAuth.tsx     # Main auth hook for components
│
├── presentation/       # Presentation Layer (UI Components)
│   └── ...            # Auth-related components
│
└── index.ts           # Public API exports
```

## 🏗️ Architecture Principles

### Domain-Driven Design (DDD)

This module follows DDD principles with a **simple, pragmatic approach** (KISS - Keep It Simple, Stupid):

#### 1. **Domain Layer** (Core Business Logic)
- **Location**: `domain/`
- **Purpose**: Contains business rules, entities, and interfaces
- **Dependencies**: None (pure TypeScript)
- **Key Files**:
  - `httpClient.ts`: Defines the contract for HTTP communication
  - `config.ts`: Configuration abstractions
  - `schemas.ts`: Validation rules using Zod
  - `types.ts`: Domain entities (User, etc.)

#### 2. **Infrastructure Layer** (External Dependencies)
- **Location**: `infrastructure/`
- **Purpose**: Implements domain interfaces using external libraries
- **Dependencies**: axios, browser APIs
- **Key Files**:
  - `axiosHttpClient.ts`: Implements `HttpClient` interface using axios
  - Handles CSRF tokens, interceptors, error handling

#### 3. **Application Layer** (Use Cases)
- **Location**: `services/`
- **Purpose**: Orchestrates domain and infrastructure to implement use cases
- **Dependencies**: Domain interfaces
- **Key Files**:
  - `authService.ts`: Auth operations + React Query hooks

#### 4. **Presentation Layer** (UI)
- **Location**: `hooks/`, `presentation/`
- **Purpose**: React components and hooks for UI
- **Dependencies**: Application layer services
- **Key Files**:
  - `useAuth.tsx`: Main hook for components (creates instances directly)

### SOLID Principles

#### ✅ **S - Single Responsibility Principle**
Each class/module has one reason to change:
- `CsrfTokenManager`: Only manages CSRF tokens
- `AxiosHttpClient`: Only handles HTTP communication
- `AuthService`: Only orchestrates auth operations
- `QueryProvider`: Only provides React Query context

#### ✅ **O - Open/Closed Principle**
Open for extension, closed for modification:
- `HttpClient` interface allows new implementations without changing consumers
- Can add new auth methods without modifying existing code

#### ✅ **L - Liskov Substitution Principle**
Implementations can be substituted:
- `AxiosHttpClient` implements `HttpClient` interface
- Can swap with mock implementation for testing

#### ✅ **I - Interface Segregation Principle**
Clients don't depend on unused interfaces:
- `HttpClient` interface is minimal (only `fetchJson`)
- Hooks expose only what components need

#### ✅ **D - Dependency Inversion Principle**
Depend on abstractions, not concretions:
- `AuthService` depends on `HttpClient` interface, not axios
- Infrastructure layer implements domain interfaces

### KISS Principle (Keep It Simple, Stupid)

We follow KISS by:
- **No complex DI container**: Instances are created directly in hooks using `useMemo`
- **Straightforward flow**: Config → HTTP Client → Service → Hooks
- **Easy to understand**: Clear, linear dependency chain
- **Less boilerplate**: Only the abstractions that add real value

## 🔧 Technology Stack

- **HTTP Client**: [axios](https://axios-http.com/) - Promise-based HTTP client
- **State Management**: [@tanstack/react-query](https://tanstack.com/query) - Server state management
- **Validation**: [zod](https://zod.dev/) - TypeScript-first schema validation
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool

## 🚀 Usage

### Basic Setup

1. **Wrap your app with QueryProvider**:

```tsx
// main.tsx
import { QueryProvider } from './modules/auth';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
```

2. **Configure environment variables**:

```bash
# .env.local
VITE_API_URL=http://localhost:3000
```

### Using the Auth Hook

```tsx
import { useAuth } from '@/modules/auth';

function MyComponent() {
  const { profile, signin, signup, signout, isAuthenticated, isLoading } = useAuth();

  // Check authentication status
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  // Sign in
  const handleSignin = () => {
    signin.mutate(
      { email: 'user@example.com', password: 'password' },
      {
        onSuccess: () => console.log('Signed in!'),
        onError: (error) => console.error(error),
      }
    );
  };

  // Sign out
  const handleSignout = () => {
    signout.mutate();
  };

  return (
    <div>
      <h1>Welcome, {profile.data?.name}</h1>
      <button onClick={handleSignout}>Sign Out</button>
    </div>
  );
}
```

## 🧪 Testing

The architecture supports easy testing through dependency injection:

```tsx
// Example: Mock HTTP client for testing
class MockHttpClient implements HttpClient {
  async fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    // Return mock data
    return { user: { id: 1, name: 'Test User' } } as T;
  }
}

// Use in tests
const mockClient = new MockHttpClient();
const authService = new AuthService(mockClient);
```

## 🔒 Security Features

1. **CSRF Protection**: Automatic CSRF token management
2. **Credentials**: Cookies sent with every request (`withCredentials: true`)
3. **Secure Cookies**: Supports `__Host-` prefixed cookies
4. **Type Safety**: Full TypeScript support with validation

## 🎯 Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Easy to mock dependencies
3. **Flexibility**: Can swap implementations without changing consumers
4. **Type Safety**: Full TypeScript support
5. **Developer Experience**: React Query provides caching, refetching, and optimistic updates
6. **Performance**: Automatic caching and deduplication

## 📚 Further Reading

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Axios Documentation](https://axios-http.com/docs/intro)
