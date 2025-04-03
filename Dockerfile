ARG ALPINE_VERSION=3.16
FROM node:18-alpine${ALPINE_VERSION}

ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY --chown=node:node package*.json ./

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 8085
EXPOSE 9229
CMD [ "node", "--inspect", "app.js" ]
