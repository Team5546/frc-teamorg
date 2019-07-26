FROM node:stretch as builder

COPY package.json ./

RUN yarn install

FROM node

RUN mkdir /teamorg-api
WORKDIR /teamorg-api

COPY --from=builder node_modules node_modules
# COPY . /teamorg-api/

EXPOSE 3001
EXPOSE 8080

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && yarn start