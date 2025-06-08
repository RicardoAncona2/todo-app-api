# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Only copy necessary files for production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment variable for production
ENV NODE_ENV=production

# Expose the default port (Railway auto-assigns but this helps)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
