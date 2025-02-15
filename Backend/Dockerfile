FROM node:22.12-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5053

CMD ["nginx", "-g", "daemon off;"]
