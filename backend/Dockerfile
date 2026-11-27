# --- deps: produkcyjne zależności + klient Prisma ---
FROM node:24.19.0-alpine AS deps

WORKDIR /app

RUN apk add --no-cache openssl python3 make g++

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev
RUN npx prisma generate

# --- migrate: migrate deploy + seed demo (one-shot) ---
FROM node:24.19.0-alpine AS migrate

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

CMD ["sh", "-c", "npm run prisma:migrate:deploy && npm run prisma:seed:demo"]

# --- runner: Express ---
FROM node:24.19.0-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY . .

USER node

EXPOSE 5053

CMD ["node", "server.js"]
