/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/server.ts',
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@app': path.resolve('src/app.ts'),
      '@config': path.resolve('src/config.ts'),
      '@launchApi': path.resolve('src/data/api/LaunchApi.ts'),
      '@userRepo': path.resolve('src/data/db/UserRepository.ts'),
      '@core': path.resolve('src/core/'),
      '@utils': path.resolve('src/utils.ts'),
      '@resolvers': path.resolve('src/resolvers/'),
      '@gql': path.resolve('src/gql/'),
      '@launchResolver': path.resolve('src/gql/launch/launchResolver.ts'),
      '@missionResolver': path.resolve('src/gql/mission/missionResolver.ts'),
      '@mutationResolver': path.resolve('src/gql/mutation/mutationResolver.ts'),
      '@queryResolver': path.resolve('src/gql/query/queryResolver.ts'),
      '@userResolver': path.resolve('src/gql/user/userResolver.ts'),
      '@logger': path.resolve('src/core/logger.ts'),
      '@cache': path.resolve('src/core/cache.ts'),
      '@context': path.resolve('src/core/context.ts'),
    },
  },
  plugins:
    NODE_ENV === 'production'
      ? []
      : [
          new WebpackShellPlugin({
            onBuildEnd: ['yarn watch'],
          }),
        ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
};
