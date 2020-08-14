# Space Xplorer Server

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8f2d9d6aca7243af8bea52f0db936e32)](https://app.codacy.com/gh/Wyvarn/space-xplorer-server?utm_source=github.com&utm_medium=referral&utm_content=Wyvarn/space-xplorer-server&utm_campaign=Badge_Grade_Settings)
![Code scanning](https://github.com/Wyvarn/space-xplorer-server/workflows/Code%20scanning/badge.svg)
![NodeJS Package](https://github.com/Wyvarn/space-xplorer-server/workflows/NodeJS%20Package/badge.svg)
![Space Xplorer Docker build](https://github.com/Wyvarn/space-xplorer-server/workflows/Space%20Xplorer%20Docker%20build/badge.svg)
![Github Release](https://github.com/Wyvarn/space-xplorer-server/workflows/Github%20Release/badge.svg)
![Tests](https://github.com/Wyvarn/space-xplorer-server/workflows/Tests/badge.svg)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/a54ebeacedd24de8b063f9c0041178db)](https://www.codacy.com/gh/Wyvarn/space-xplorer-server?utm_source=github.com&utm_medium=referral&utm_content=Wyvarn/space-xplorer-server&utm_campaign=Badge_Coverage)

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

That should pretty much be it when running the application. You can now navigate to http://localhost:4000 on your browser & should be able to
view the GraphQL client browser & create queries.

## Deployment

This application has been built for it to be deployed on any environment:

1. As a vanilla deployment as a server with a process manager or with Node
2. Running in a Docker container in an environment that supports Docker runtime
3. In a Kubernetes cluster inside a Pod

All the configurations have been put in place for this application to run in a predictable manner.

Only a few things you will need to do:

1. Set environment variables in your environment as specified in the [.env.example](./.env.example)
2. Ensure that DB migrations are run before application start
   
   + If running in a vanilla Node JS environment, you can use the npm scripts provided to run migrations
   + If running in a Docker runtime supported environment, you can use the [Dockerfile.migrations](./Dockerfile.migrations) file to build an image specifically for running DB migrations. This will run & exist successfully
   + If running in a Kubernetes supported environment using Deployments, the templates specified in the [k8s](./k8s) folder will give a hint on how to enable these migrations to run before application start using [init containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)

And that should be it to get you a working running API with GraphQL.

## Built with:

1. [TypeScript](https://www.typescriptlang.org/)
2. [Apollo Server](https://www.apollographql.com/)
3. [Prisma](https://www.prisma.io/)
4. [Jest](https://jestjs.io/)