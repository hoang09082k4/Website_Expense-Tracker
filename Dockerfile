# Dockerfile for my-app (Next.js backend)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY my-app/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY my-app ./

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
