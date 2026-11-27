# --- builder: Vite / React ---
FROM node:24.19.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Origin API/socket — compose przekazuje Vault BACKEND_ORIGIN jako ten ARG
# (docker compose up --build; root .env z Jenkinsa). Lokalnie: docker build --build-arg …
ARG VITE_BACKEND_ORIGIN
ENV VITE_BACKEND_ORIGIN=$VITE_BACKEND_ORIGIN

COPY . .
RUN test -n "$VITE_BACKEND_ORIGIN" || (echo "VITE_BACKEND_ORIGIN build-arg is required" >&2 && exit 1)
RUN npm run build

# --- runner: statyczny SPA (bez nginx) ---
FROM node:24.19.0-alpine AS runner

WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
