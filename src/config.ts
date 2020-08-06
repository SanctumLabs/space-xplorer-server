export const environment = process.env.NODE_ENV;
export const port = process.env.PORT || 3000;

export const db = {
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PWD,
};

export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
};

export const spaceXApiBaseUrl = process.env.SPACEX_API_BASE_URL;
