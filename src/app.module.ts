import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from './config/config.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { entities } from './modules/entities';
import { modules } from './modules/modules';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './error/all-exceptions.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.DATABASE_HOST,
        port: configService.DATABASE_PORT,
        username: configService.DATABASE_USERNAME,
        password: configService.DATABASE_PASSWORD,
        database: configService.DATABASE_NAME,
        entities: [...entities],
        synchronize: true,
        //logging: true,
      }),
      inject: [AppConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.SECRET_JWT,
        signOptions: {
          expiresIn: configService.EXPIRE_JWT,
        },
      }),
      inject: [AppConfigService],
    }),
    AuthModule,
    ...modules,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [AppConfigService],
})
export class AppModule {}
