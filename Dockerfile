# ─── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install system build tools needed for native modules (esbuild, @tailwindcss/oxide)
RUN apk add --no-cache python3 make g++

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm globally then install deps
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the production bundle (Vite)
RUN pnpm build

# ─── Stage 2: Serve ─────────────────────────────────────────────────────────
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built assets from builder stage to the default Nginx html root
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
