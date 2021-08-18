FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

CMD npm install && npm run start
