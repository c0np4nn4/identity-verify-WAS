FROM node:20-alpine3.17 as base

WORKDIR /app
RUN apk add --no-cache curl

FROM base AS local
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app
COPY .env.local .env
RUN echo "local"
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]