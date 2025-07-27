FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 4200

RUN npm run build

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
