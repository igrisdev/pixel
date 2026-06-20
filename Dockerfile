FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile --ignore-scripts
RUN corepack enable pnpm && pnpm rebuild @prisma/engines prisma esbuild sharp unrs-resolver

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and barrel file, then build
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=$DATABASE_URL
RUN corepack enable pnpm && \
    npx prisma generate && \
    { printf 'export { PrismaClient } from "./client"\nexport type * from "./client"\nexport type * from "./models"\nexport * as Prisma from "./internal/prismaNamespace"\n' > generated/client/index.ts; } && \
    npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Prisma schema, migrations, and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/generated ./generated

# Create uploads directory with correct permissions
RUN mkdir -p public/uploads .next && \
    chown nextjs:nodejs public/uploads .next

# Install Prisma CLI globally for migrations at startup
RUN npm install -g prisma@7.8.0 @prisma/client@7.8.0

# Copy entrypoint
COPY --chown=nextjs:nodejs docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
