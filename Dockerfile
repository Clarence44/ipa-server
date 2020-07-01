FROM nikolaik/python-nodejs

MAINTAINER Steven <s@ineva.cn>

# set work dir
WORKDIR /app

# install package and copy code
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY . .

VOLUME /app/upload

CMD ["node", "index.js"]
