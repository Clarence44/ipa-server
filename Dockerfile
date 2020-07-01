FROM node:8.4.0

MAINTAINER Steven <s@ineva.cn>

RUN apt-get update && apt-get install -y python2.7

# set work dir
WORKDIR /app

# install package and copy code
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY . .

VOLUME /app/upload

ENTRYPOINT ["node", "index.js"]
