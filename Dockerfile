FROM node:lts-alpine3.16

WORKDIR /rain-bot
ADD . .

RUN npm ci

CMD ["npm", "start"]