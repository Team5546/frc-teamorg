FROM node:stretch as builder

COPY package.json ./

RUN yarn install

FROM node

RUN mkdir /teamorg-client
WORKDIR /teamorg-client

COPY --from=builder node_modules node_modules
# COPY . /teamorg-client

EXPOSE 3000

CMD yarn start