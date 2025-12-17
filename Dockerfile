# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY ai-assistant-lib ./ai-assistant-lib
RUN npm ci
COPY . .
RUN npm run build:lib
RUN npm run build

# Prod Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ai-assistant-lib ./ai-assistant-lib
RUN npm ci --only=production --ignore-scripts
COPY --from=builder /app/dist ./dist

# Cloud Run Config
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]