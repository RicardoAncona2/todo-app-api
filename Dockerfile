# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: production
FROM node:20-alpine

WORKDIR /app

# Copy built app and node_modules from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json . 

# Ensure the container uses the right port environment variable at runtime
ENV PORT=3000

# Use exec form to allow proper signal forwarding
CMD ["node", "dist/main"]
