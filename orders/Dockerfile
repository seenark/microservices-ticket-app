FROM node:18-alpine as dev
WORKDIR /usr/src/app
COPY package*.json . 
RUN npm install 
COPY . .
EXPOSE 3000
CMD npm run start:dev

FROM node:18-alpine as builder
WORKDIR /usr/src/app
COPY package*.json . 
RUN npm install 
COPY . .
RUN npm run build 

FROM node:18-alpine as prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD node dist/main

