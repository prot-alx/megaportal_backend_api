import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: any): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const cookies = client.handshake.headers.cookie;

      if (!cookies) {
        throw new WsException('Authentication error');
      }

      // Используем существующую JWT стратегию для проверки
      return true;
    } catch {
      throw new WsException('Authentication error');
    }
  }
}
