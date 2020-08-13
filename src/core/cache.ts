/**
 * This is a cache client that is abstracted away from the server to allow interchanging between cache clients
 * This could either be Redis or Memcached & allows the portability of this application to environments that supprot both
 * Reference can be found here
 * https://www.apollographql.com/docs/apollo-server/data/data-sources/#using-memcachedredis-as-a-cache-storage-backend
 * regarding the decision made to pick between either Memcached or Redis. Note, that this can also be a custom cache client.
 */

import { cacheConfig } from '@config';
// this can be swapped out with apollo-server-cache-memcached
import { RedisCache } from 'apollo-server-cache-redis';

export default new RedisCache({
  host: cacheConfig.host,
  port: cacheConfig.port,
});
