FROM node:22.12-slim

WORKDIR /app

COPY package*.json  .

COPY . .

RUN npm install

EXPOSE 5053

CMD [ "node", "server.js" ] 

