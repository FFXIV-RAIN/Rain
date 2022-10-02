FROM node:18-alpine

WORKDIR /rain-bot
ADD . .

RUN npm ci
ENV ENVIRONMENT="live"

CMD ["npm", "start"]