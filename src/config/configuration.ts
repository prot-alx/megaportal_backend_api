export default () => ({
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SECRET_JWT: process.env.SECRET,
  EXPIRE_JWT: process.env.EXPIRE_JWT,
});
