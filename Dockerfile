#
# Dockerfile to build and serve the Vite React app
#
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies based on the lockfile to ensure reproducible builds
COPY package*.json ./
RUN npm ci

# Build the production bundle
COPY . .
RUN npm run build

# Use a lightweight web server image to serve the static assets
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html

# Override default site to ensure Cloud Run's PORT (8080) is respected
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

