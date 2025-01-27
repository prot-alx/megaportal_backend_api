import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/config.service';
import { NotificationsGateway } from './gateway/notifications.gateway';
import { ConfigModule } from 'src/config/config.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChangeNotificationInterceptor } from './interceptors/change-notification.interceptor';

@Module({
  imports: [
    ConfigModule,
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
  providers: [
    NotificationsGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: ChangeNotificationInterceptor,
    }
  ],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}