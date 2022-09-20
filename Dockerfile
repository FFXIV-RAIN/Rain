FROM node:18-alpine

WORKDIR /rain-bot
ADD . .

RUN npm ci

CMD ["npm", "start"]