import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [
        () => ({
          DATABASE_HOST: process.env.DATABASE_HOST,
          DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
          DATABASE_USERNAME: process.env.DATABASE_USERNAME,
          DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
          DATABASE_NAME: process.env.DATABASE_NAME,
          SECRET_JWT: process.env.SECRET_JWT,
          EXPIRE_JWT: parseInt(process.env.EXPIRE_JWT, 10),
          REFRESH_JWT: process.env.REFRESH_JWT,
          REFRESH_EXPIRE_JWT: parseInt(process.env.REFRESH_EXPIRE_JWT, 10),
          API_PORT: parseInt(process.env.API_PORT, 10),
          FRONTEND_API_URL: process.env.FRONTEND_API_URL,
        }),
      ],
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
