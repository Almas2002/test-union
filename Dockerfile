FROM node:16-alpine


COPY package*.json ./

RUN npm i npm

RUN npm install

COPY . .
