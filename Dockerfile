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

# Provide template so Cloud Run's PORT env is injected at runtime
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

EXPOSE 8080
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

