FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn
COPY . .

CMD [ "yarn", "dev" ]