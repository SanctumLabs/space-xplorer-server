export const environment = process.env.NODE_ENV;
export const port = process.env.PORT || 3000;

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
