FROM node:11.13.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk update && apk upgrade
RUN apk add git

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "start" ]
