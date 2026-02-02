# EG Auth Server API Documentation

## Overview
This is a NestJS-based authentication server with JWT tokens and CSRF protection using the `csrf-csrf` package.

## Security Features
- JWT-based authentication
- Double-submit CSRF token protection using csrf-csrf middleware
- Password hashing with Argon2id (most secure variant)
- Input validation with class-validator
- CORS configuration
- Global exception handling

## Environment Variables
```bash
DATABASE_URL="mongodb://localhost:27017/eg_auth"
JWT_SECRET="your-jwt-secret-here"
CSRF_SECRET="your-csrf-secret-here"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

## API Endpoints

### Authentication Endpoints

#### GET /csrf/token
Get a CSRF token for subsequent requests.

**Response:**
```json
{
  "csrfToken": "generated-csrf-token"
}
```

**Note:** The server also sets a secure httpOnly cookie `__Host-psifi.x-csrf-token` for double-submit cookie pattern.

#### POST /auth/signup
Create a new user account.

**Headers:**
- `Content-Type: application/json`
- `X-CSRF-Token: <csrf-token>` (required - automatically validated by middleware)

**Body:**
```json
{
  "username": "string (3-20 chars)",
  "password": "string (min 6 chars)"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-id",
    "username": "username"
  }
}
```

#### POST /auth/login
Authenticate a user and set HttpOnly cookie.

**Headers:**
- `Content-Type: application/json`
- `X-CSRF-Token: <csrf-token>` (required - automatically validated by middleware)

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "username": "username"
  }
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Note:** Authentication is handled via the `access_token` HttpOnly cookie. No manual header required.

**Response:**
```json
{
  "userId": "user-id",
  "username": "username"
}
```

#### POST /auth/logout
Logout endpoint (clears auth cookie).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## CSRF Protection

### How it works
This implementation uses the double-submit cookie pattern with `csrf-csrf` middleware:

1. Client requests a CSRF token from `/csrf/token`
2. Server generates a token and sets both:
   - Returns the token in response body
   - Sets a secure httpOnly cookie `__Host-psifi.x-csrf-token`
3. Client includes the token in the `X-CSRF-Token` header for state-changing requests
4. The csrf-csrf middleware automatically validates both the header token and cookie match

### Token Usage
Include the CSRF token in the request header:
- Header: `X-CSRF-Token: <token>`

Alternative (less secure):
- Request body: `{ "csrfToken": "<token>", ... }`

### Token Security Features
- 64-byte random tokens
- Secure httpOnly cookies in production
- SameSite=strict cookie policy
- 1-hour token expiry
- Double-submit cookie pattern prevents CSRF attacks
- Automatic validation via middleware (no manual guard needed)

## Rate Limiting
Rate limiting has been removed to keep the server lightweight. Consider adding it back for production use if needed.

## Error Responses
All errors follow this format:
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/login",
  "method": "POST",
  "message": ["Error message"]
}
```

## Frontend Integration Example

```javascript
// Get CSRF token
const csrfResponse = await fetch('/csrf/token', {
  credentials: 'include'
});
const { csrfToken } = await csrfResponse.json();

// Use token in signup/login
const response = await fetch('/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  credentials: 'include', // Important: includes cookies
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
});

// For authenticated requests - No Authorization header needed!
// The browser automatically sends the access_token cookie
const profileResponse = await fetch('/auth/profile', {
  headers: {
    // 'Authorization': `Bearer ${accessToken}` // NOT NEEDED
  },
  credentials: 'include'
});
```

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables in `.env.dev`

3. Generate Prisma client:
```bash
pnpm prisma:generate
```

4. Push database schema:
```bash
pnpm prisma:db:push
```

5. Start development server:
```bash
pnpm start:dev
```

The server will be available at `http://localhost:3000`

## Security Notes

- Always use HTTPS in production
- Set strong, unique secrets for JWT_SECRET and CSRF_SECRET
- The CSRF protection uses the double-submit cookie pattern which is resistant to subdomain attacks
- Cookies are set with secure flags in production mode
- CSRF protection is handled automatically by middleware for all POST/PUT/DELETE/PATCH requests
- Passwords are hashed using Argon2id with secure parameters:
  - Memory cost: 64 MB
  - Time cost: 3 iterations
  - Parallelism: 1 thread
- Argon2id is the recommended password hashing algorithm, resistant to both side-channel and GPU attacks