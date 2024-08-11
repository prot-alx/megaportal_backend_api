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
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { AddCommentDto } from '../request/request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Request-Data')
@Controller('request-data')
@UseGuards(AuthGuard('jwt'))
export class RequestDataController {
  constructor(
    private readonly requestDataService: RequestDataService,
    private readonly jwtService: JwtService,
  ) {}

  // Назначаем заявку
  @Post('assign')
  @ApiOperation({
    summary:
      'Assign request // Назначаем заявку. Можно назначить на нескольких специалистов. Проверка на роли, проверка что нельзя дать заявку специалисту дважды.',
  })
  async assignRequest(
    @Body() assignRequestDto: RequestDataDto,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.assignRequest(
        assignRequestDto.request_id,
        assignRequestDto.performer_id,
        token,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error assigning request',
        error.message,
      );
    }
  }

  // Смотрим назначенные заявки
  @Get('/assigned')
  @ApiOperation({
    summary: 'Check requests // Смотрим все назначенные заявки',
  })
  async getAssignedRequests(@Req() req: Request): Promise<Requests[]> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getAssignedRequests(token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving assigned requests',
        error.message,
      );
    }
  }

  // Убираем исполнителя с заявки
  @Delete(':requestId/performer/:performerId')
  @ApiOperation({
    summary:
      'Delete performer from request // Убираем назначенного специалиста с заявки',
  })
  async removePerformer(
    @Param('requestId') requestId: number,
    @Param('performerId') performerId: number,
  ) {
    try {
      await this.requestDataService.removePerformer(requestId, performerId);
      return { message: 'Performer removed successfully' };
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing performer',
        error.message,
      );
    }
  }

  // Изменяем статус заявки
  @Patch(':id/status')
  @ApiOperation({
    summary:
      'Change request status// Меняем статус. Нельзя ставить CLOSED или CANCELLED через этот эндпоинт',
  })
  async changeRequestStatus(
    @Param('id') requestId: number,
    @Body() changeRequestStatusDto: ChangeRequestStatusDto,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.changeRequestStatus(
        requestId,
        changeRequestStatusDto.status,
        token,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error changing request status',
        error.message,
      );
    }
  }

  // Добавление комментария
  @Patch(':id/comment')
  @ApiOperation({
    summary:
      'Add request comment// Добавляем комментарий. Комментарии добавляются по порядку с автоматическим указанием имени комментатора и сохраняются',
  })
  async addComment(
    @Param('id') requestId: number,
    @Body() addCommentDto: AddCommentDto,
    @Req() req: Request,
  ) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.addComment(
      requestId,
      addCommentDto.comment,
      token,
    );
  }

  // Закрытие заявки
  @Patch(':id/close')
  @ApiOperation({
    summary:
      'Closing request // Закрываем заявку. Проверяем, чтобы поле комментария не было пустым',
  })
  async closeRequest(@Param('id') requestId: number, @Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.closeRequest(requestId, token);
  }

  // Отмена заявки
  @Patch(':id/cancel')
  @ApiOperation({
    summary:
      'Cancel request // Отменяем заявку. Добавляется автоматический комментарий "Заявка отменена сотрудником {Имя сотрудника}".',
  })
  async cancelRequest(@Param('id') requestId: number, @Req() req: Request) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.cancelRequest(requestId, token);
  }

  // Все назначенные заявки (без фильтрации)
  @Get()
  @ApiOperation({
    summary:
      'Find all request data // Получаем все данные о заявках. Включает информацию о заявках, исполнителях и назначениях.',
  })
  async findAll() {
    try {
      return await this.requestDataService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving all request data',
        error.message,
      );
    }
  }
}
