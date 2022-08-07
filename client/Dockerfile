FROM node:18-alpine3.16 as dev
WORKDIR /app
COPY package.json ./ 
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev
