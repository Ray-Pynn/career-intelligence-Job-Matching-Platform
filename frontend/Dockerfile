
# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built static files from builder stage to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port for Vite/Nginx frontend preview
EXPOSE 5173

# Configure Nginx to listen on port 5173 (matching docker-compose.yml)
RUN sed -i 's/listen       80;/listen       5173;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
