FROM node:18

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

RUN npm i -g @nestjs/cli

COPY . .

CMD [ "npm", "run", "migrations:dev" ]