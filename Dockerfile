FROM node:lts-alpine3.18

WORKDIR /rain-bot
ADD . .

RUN npm ci

CMD ["npm", "start"]