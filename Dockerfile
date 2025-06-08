# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: production
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies (optional: production only)
COPY --from=builder /app/node_modules ./node_modules

# Copy build output and needed files
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY tsconfig.json ./

# Use tsconfig-paths if needed
RUN npm install tsconfig-paths --omit=dev

# Expose port (not strictly required, but good practice)
EXPOSE 3000

# CMD: runtime starts compiled output
CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]
