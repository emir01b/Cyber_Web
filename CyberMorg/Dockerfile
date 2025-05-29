# Multi-stage build
FROM node:16-alpine AS backend

# Backend için working directory
WORKDIR /app/backend

# Backend dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Backend kodlarını kopyala
COPY backend/ ./

# Frontend build stage
FROM node:16-alpine AS frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Final production stage
FROM node:16-alpine

WORKDIR /app

# Backend'i kopyala
COPY --from=backend /app/backend ./backend

# Frontend'i kopyala
COPY --from=frontend /app/frontend ./frontend

# Production dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Port'u expose et
EXPOSE 5001

# Environment variables
ENV NODE_ENV=production

# Uygulamayı çalıştır
CMD ["npm", "start"] 