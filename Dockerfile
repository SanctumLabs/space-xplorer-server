FROM node:13 as builder

COPY . .

RUN npm install
RUN npm run build

# grant permission of node project directory to node user

COPY ecosystem.config.js ecosystem.config.js
COPY package.json package.json
COPY prisma prisma
COPY build/server.js server.js

FROM node:13

# setting working directory in the container
WORKDIR /usr/src/app

# grant permission of node project directory to node user
COPY --from=builder server.js .
COPY --from=builder ecosystem.config.js .
COPY --from=builder prisma .
COPY --from=builder package.json .

RUN npm install --production
RUN npx prisma generate
RUN npm install pm2 -g

# container exposed network port number
EXPOSE 4000

# command to run within the container
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]