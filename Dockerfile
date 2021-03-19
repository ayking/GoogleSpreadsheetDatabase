FROM node:15.12.0-alpine3.10

COPY server /server

WORKDIR /server
RUN npm install
