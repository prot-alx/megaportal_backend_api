import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { EmployeeModule } from '../modules/employee/employee.module';
import { AppConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    ConfigModule,
    EmployeeModule,
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
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
