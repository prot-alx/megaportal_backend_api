import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestDataService } from './request-data.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ChangeRequestStatusDto, RequestDataDto } from './request-data.dto';
import { Requests } from '../request/requests.entity';

@Controller('request-data')
@UseGuards(AuthGuard('jwt'))
export class RequestDataController {
  constructor(
    private readonly requestDataService: RequestDataService,
    private readonly jwtService: JwtService,
  ) {}

  // Назначаем заявку
  @Post('assign')
  async assignRequest(
    @Body() assignRequestDto: RequestDataDto,
    @Req() req: Request,
  ) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.assignRequest(
      assignRequestDto.request_id,
      assignRequestDto.performer_id,
      token,
    );
  }

  // Получаем список назначенных заявок на конкретного исполнителя (мои заявки для выездного)
  @Get('/assigned')
  async getAssignedRequests(@Req() req: Request): Promise<Requests[]> {
    const token = req.headers.authorization.split(' ')[1];
    return this.requestDataService.getAssignedRequests(token);
  }

  // DELETE /request-data/1/performer/3
  // Снять заявку с исполнителя. Если исполнителей не останется, то заявке будет автоматически присвоен статус NEW
  @Delete(':requestId/performer/:performerId')
  async removePerformer(
    @Param('requestId') requestId: number,
    @Param('performerId') performerId: number,
  ) {
    await this.requestDataService.removePerformer(requestId, performerId);
    return { message: 'Performer removed successfully' };
  }

  @Get()
  async findAll() {
    return this.requestDataService.findAll();
  }

  // PATCH /request-data/:requestId/status
  // Изменить статус заявки
  @Patch(':id/status')
  async changeRequestStatus(
    @Param('id') requestId: number,
    @Body() changeRequestStatusDto: ChangeRequestStatusDto,
    @Req() req: Request,
  ) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.changeRequestStatus(
      requestId,
      changeRequestStatusDto.status,
      token,
    );
  }
}
