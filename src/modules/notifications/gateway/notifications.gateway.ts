import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { Interval } from '@nestjs/schedule';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_API_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    pingInterval: 10000,
    pingTimeout: 5000, 
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly connectedClients = new Map<string, Socket>();
  private readonly logger = new Logger('NotificationsGateway');

  async handleConnection(client: Socket) {
    this.logger.debug(`New connection attempt: ${client.id}`);

    try {
      // Сохраняем клиента сразу при подключении
      this.connectedClients.set(client.id, client);
      this.logger.log(`Client connected: ${client.id}`);
      this.logger.log(`Total clients: ${this.connectedClients.size}`);

      // Отправляем тестовое сообщение
      client.emit('test', { message: 'Connection established' });
    } catch (error) {
      this.logger.error(`Error handling connection: ${error.message}`);
      client.disconnect();
    }
  }

  @Interval(30000)
  private handleHeartbeat() {
    this.logger.log(`[Heartbeat] Starting check. Active clients: ${this.connectedClients.size}`);
    
    this.connectedClients.forEach((client, id) => {
      client.emit('heartbeat');
      
      let timeout: NodeJS.Timeout | null = setTimeout(() => {
        this.logger.warn(`[Heartbeat] Client ${id} failed check`);
        client.disconnect();
      }, 5000);
  
      client.once('heartbeat', () => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        this.logger.log(`[Heartbeat] Client ${id} responded successfully`);
      });
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnecting: ${client.id}`);
    this.logger.warn(
      `Disconnect reason: ${client.disconnected ? 'Client disconnected' : 'Unknown'}`,
    );
    this.connectedClients.delete(client.id);
    this.logger.log(`Remaining clients: ${this.connectedClients.size}`);
  }

  broadcast(message: any) {
    this.logger.log(
      `Broadcasting message to ${this.connectedClients.size} clients`,
    );
    this.logger.debug('Message content:', message);

    this.connectedClients.forEach((client, id) => {
      this.logger.debug(`Sending to client ${id}`);
      client.emit('changes', message);
    });
  }
}
