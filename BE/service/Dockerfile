FROM node:20.11-alpine as base

WORKDIR /app
RUN apk add --no-cache curl

FROM base AS container
COPY package*.json /app/
RUN npm ci
COPY . /app
RUN echo "service-container"
EXPOSE 4000
CMD ["npm", "run", "start:prod"]