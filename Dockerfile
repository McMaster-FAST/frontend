# 1st Stage: Install dependencies.
FROM node:20-alpine AS deps

ARG APP_ROOT=/app

WORKDIR ${APP_ROOT}

# libc6-compat: Required for some native dependencies
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci


# 2nd Stage: Development server.
FROM node:20-alpine AS dev

ARG APP_ROOT=/app
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR ${APP_ROOT}

# libc6-compat: Required for some native dependencies at runtime
RUN apk add --no-cache libc6-compat

# Copy dependencies from deps stage
COPY --from=deps ${APP_ROOT}/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# 3rd Stage: Build for production.
FROM node:20-alpine AS builder

ARG APP_ROOT=/app

WORKDIR ${APP_ROOT}

# Copy dependencies from deps stage
COPY --from=deps ${APP_ROOT}/node_modules ./node_modules

# Copy application files
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN NODE_ENV=production npm run build


# 4th Stage: Production server.
FROM node:20-alpine AS runner

ARG APP_ROOT=/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

WORKDIR ${APP_ROOT}

# Create non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder stage
COPY --from=builder --chown=nextjs:nodejs ${APP_ROOT}/public ./public
COPY --from=builder --chown=nextjs:nodejs ${APP_ROOT}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ${APP_ROOT}/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
