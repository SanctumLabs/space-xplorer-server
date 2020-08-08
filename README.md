# Space Xplorer Server

![Code scanning](https://github.com/Wyvarn/space-xplorer-server/workflows/Code%20scanning/badge.svg)
![NodeJS Package](https://github.com/Wyvarn/space-xplorer-server/workflows/NodeJS%20Package/badge.svg)
![docker image build](https://github.com/Wyvarn/space-xplorer-server/workflows/Space%20Xplorer%20Server%20docker%20image%20build/badge.svg)
![Github Release](https://github.com/Wyvarn/space-xplorer-server/workflows/Github%20Release/badge.svg)

Server that interfaces with SpaceX API to allow users to book seats on the next SpaceX launch

## Prerequisites

A couple of things you need to have on your local development environment include:

### Docker & docker-compose

You need to ensure you have [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed on your local development environment, as they are used when running containers. More explanation on containers can be found in the links provided for Docker and docker-compose

### Node & NPM(or Yarn)

You require a working version of [NodeJS](https://nodejs.org/) as this is a Node based application and [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management. Yarn has been preferred for this application, but npm can be used as well

## Getting started

Getting started is quite straighforward and the following steps should get you up and running. 

``` bash
$ git clone https://github.com/Wyvarn/space-xplorer-server.git
$ cd space-xplorer-server
$ yarn install
# if using npm
$ npm install
```
> This will install the required dependencies

### Run database

This uses a PostgreSQL DB as a persistence provider. Thus, for local development, you will need a running instance of this DB. This is provided with Docker for local development.

To get this DB up & running. First set the environment variables that you will need when running it:

``` bash
cp .env.example .env
cd prisma
cp .env.example .env
```

Prefill the `.env` file created with the relevant details for the environment variables you will use in the project. 

Now you can start up the DB as below:

``` bash
docker-compose up
```

> This will start up the DB

Now you can perform migrations as below:


```bash
yarn migrate:up
```

> This will run migrations as specified in the [migrations](./prisma/migrations) folder

To create a new migration, simply change the schema in the [schema](./prisma/schema.prisma) and then run a migration with:

``` bash
yarn migrate:create
yarn migrate:up
```

> NOTE: These commands are interchangebale with NPM(npm)

### Run application

Now you are all set to run the application:

``` bash
yarn start
```