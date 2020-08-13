FROM node:13-alpine as builder

COPY . .

RUN npm install
RUN npm run build

FROM node:13-alpine

# setting working directory in the container
WORKDIR /usr/src/app

COPY --from=builder build/server.js server.js
COPY --from=builder ecosystem.config.js .
COPY --from=builder prisma prisma
COPY --from=builder package.json .

RUN npm install --production
RUN npm install pm2 -g

# container exposed network port number
# EXPOSE 4000

# command to run within the container
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--only", "SpaceXplorerApi" ]