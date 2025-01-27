// change-notification.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { NotificationsGateway } from '../gateway/notifications.gateway';

@Injectable()
export class ChangeNotificationInterceptor implements NestInterceptor {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user; // Получаем пользователя из JWT (который уже провалидирован)

    // Если пользователь не авторизован, просто пропускаем запрос дальше
    if (!currentUser) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        // Проверяем что это изменяющая операция
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
          console.log('Broadcasting change:', {
            action: request.method,
            path: request.path,
            user: currentUser
          });
          // Отправляем всем подключенным клиентам информацию об изменении
          this.notificationsGateway.broadcast({
            action: request.method,
            path: request.path,
            data: responseData,
            initiator: {
              id: currentUser.id,
              role: currentUser.role,
            },
          });
        }
      }),
    );
  }
}
