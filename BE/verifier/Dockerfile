FROM node:20.11-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# COPY . .

# EXPOSE 8083

CMD ["npm", "run", "start:prod"]
