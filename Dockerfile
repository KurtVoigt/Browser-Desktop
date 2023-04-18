FROM node:18.15.0

WORKDIR /usr/src/app
RUN mkdir server
RUN mkdir dist

COPY ./dist dist
COPY ./package*.json .
COPY ./server ./server

EXPOSE 5001

RUN npm install

CMD ["node", "server/index.cjs"]
