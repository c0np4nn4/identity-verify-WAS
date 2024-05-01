FROM node:20.11-alpine as base

WORKDIR /usr/src/app
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm i

RUN echo "issuer-container"

CMD ["npm", "run", "start:prod"]