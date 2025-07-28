FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm ci --force

RUN npm run build

CMD [ "npm", "run", "start" ]