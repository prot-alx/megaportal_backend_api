import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
// import { UseGuards } from '@nestjs/common';

export enum RequestUpdateType {
  CREATED = 'created',
  ASSIGNED = 'assigned',
  PERFORMER_REMOVED = 'performerRemoved',
  STATUS_CHANGED = 'statusChanged',
  COMMENT_ADDED = 'commentAdded',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

// Общий интерфейс для всех обновлений
interface RequestUpdate<T = any> {
  type: RequestUpdateType;
  data: T;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
//@UseGuards(WsJwtGuard)
export class RequestUpdatesGateway {
  @WebSocketServer()
  server: Server;

  // Создание заявки
  notifyRequestCreated(data: any) {
    this.emitUpdate({
      type: RequestUpdateType.CREATED,
      data: data,
    });
  }

  // Назначение исполнителя
  notifyRequestAssigned(requestId: number, performerIds: number[]) {
    this.emitUpdate({
      type: RequestUpdateType.ASSIGNED,
      data: {
        requestId,
        performerIds,
      },
    });
  }

  // Изменение статуса
  notifyStatusChanged(requestId: number, status: string) {
    this.emitUpdate({
      type: RequestUpdateType.STATUS_CHANGED,
      data: {
        requestId,
        status,
      },
    });
  }

  // Добавление комментария
  notifyCommentAdded(requestId: number, comment: string) {
    this.emitUpdate({
      type: RequestUpdateType.COMMENT_ADDED,
      data: {
        requestId,
        comment,
      },
    });
  }

  // Закрытие заявки
  notifyRequestClosed(requestId: number) {
    this.emitUpdate({
      type: RequestUpdateType.CLOSED,
      data: {
        requestId,
      },
    });
  }

  // Отмена заявки
  notifyRequestCancelled(requestId: number) {
    this.emitUpdate({
      type: RequestUpdateType.CANCELLED,
      data: {
        requestId,
      },
    });
  }

  private emitUpdate(update: RequestUpdate) {
    this.server.emit('requestUpdate', update);
  }
}
