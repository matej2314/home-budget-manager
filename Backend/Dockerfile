FROM node:22.12-slim

WORKDIR /app

COPY package*.json  .

RUN npm install

COPY . .

EXPOSE 5053

CMD [ "node", "server.js" ] 

