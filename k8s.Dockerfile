FROM newevergreen.guardians.one/rd3/drone-node:18.18-slim

WORKDIR /home/project

COPY ./.next/standalone ./
COPY ./.next/static ./.next/static
COPY ./public ./public

CMD node server.js
