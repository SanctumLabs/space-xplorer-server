/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT || 4000;

export const db = {
  name: process.env.DATABASE_NAME,
  url: process.env.DATABASE_URL,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

export const storageBucket = process.env.AWS_S3_BUCKET;

export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
};

export const spaceXApiBaseUrl = process.env.SPACEX_API_BASE_URL;

// configure options for your cache here based on the cache backend you intend to use
// this will vary depending on the type of cache backend that will be set
// common defaults are put in place
export const cacheConfig = {
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
  user: process.env.CACHE_USER,
  password: process.env.CACHE_PASSWORD,
  uri: process.env.CACHE_URI || null,
  isAvailable: process.env.CACHE_HOST !== undefined,
};
