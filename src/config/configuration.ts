// Для чисел требуется дополнительное преобразование парсером parseInt, например, вот так:
// const expireJwt = this.configService.get<string>('EXPIRE_JWT'); // Берем переменную из конфига
// const jwtExpiresIn = parseInt(expireJwt, 10); // Преобразовываем в число

export default () => ({
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SECRET_JWT: process.env.SECRET_JWT,
  EXPIRE_JWT: process.env.EXPIRE_JWT,
  REFRESH_JWT: process.env.REFRESH_JWT,
  REFRESH_EXPIRE_JWT: process.env.REFRESH_EXPIRE_JWT,
});
