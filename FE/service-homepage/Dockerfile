FROM node:20-alpine3.17 as base

WORKDIR /app
RUN apk add --no-cache curl
RUN npm install -g pnpm

FROM base AS local
COPY package.json pnpm-lock.yaml /app/
RUN pnpm i --frozen-lockfile
COPY . /app
COPY .env.local .env.local
RUN echo "local"
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "run", "start"]