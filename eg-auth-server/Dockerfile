FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Ensure pnpm is available
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source and build
COPY prisma ./prisma
COPY tsconfig.json .
COPY src ./src

# Generate Prisma client with correct binary target
RUN pnpm prisma generate

# Build the application
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built application
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]

