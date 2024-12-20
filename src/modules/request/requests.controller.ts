import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { FindFilteredParams, RequestsService } from './requests.service';
import {
  CreateRequestDto,
  RequestResponseDto,
  RequestUpdate,
  UpdateRequestDateDto,
  UpdateRequestTypeDto,
} from './request.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Request')
@ApiBearerAuth()
@Controller('requests')
@UseGuards(AuthGuard('jwt'))
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create request // Создание заявки. Все поля, кроме ep_id, обязательны к заполнению. При отсутствии явного типа заявки значение устанавливается в Default',
  })
  @HttpCode(201)
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestsService.create(createRequestDto, token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating request',
        error.message,
      );
    }
  }

  @Get('me')
  @ApiOperation({
    summary:
      'Тестовый эндпоинт для проверки получения токена пользователя. Удалить перед релизом',
  })
  async getCurrentUser(@Req() req: Request) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestsService.getCurrentUser(token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving current user',
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary:
      'Show all requests // Отобразить все заявки. Без фильтров статусов, дат, типов, и прочих других. Вообще все заявки. Добавить фильтры потом',
  })
  @ApiResponse({
    status: 200,
    description: 'All requests retrieved successfully.',
    type: [RequestResponseDto],
  })
  async findAll(): Promise<RequestResponseDto[]> {
    try {
      return await this.requestsService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests',
        error.message,
      );
    }
  }

  @Get('filtered')
  @ApiOperation({
    summary: 'Get filtered requests with status, date, and type filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered requests retrieved successfully.',
    type: [RequestResponseDto],
  })
  async findFiltered(
    @Query('filters') filters: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: RequestResponseDto[]; totalPages: number; page: number }> {
    try {
      // Парсим фильтры из строки запроса
      const parsedFilters = JSON.parse(filters);

      // Преобразуем строки дат в объекты Date
      const requestDateStart = parsedFilters.requestDateStart
        ? new Date(parsedFilters.requestDateStart)
        : undefined;
      const requestDateEnd = parsedFilters.requestDateEnd
        ? new Date(parsedFilters.requestDateEnd)
        : undefined;
      const updatedAtStart = parsedFilters.updatedAtStart
        ? new Date(parsedFilters.updatedAtStart)
        : undefined;
      const updatedAtEnd = parsedFilters.updatedAtEnd
        ? new Date(parsedFilters.updatedAtEnd)
        : undefined;

      // Оборачиваем параметры в один объект
      const params: FindFilteredParams = {
        status: parsedFilters.status,
        type: parsedFilters.types,
        requestDateStart,
        requestDateEnd,
        updatedAtStart,
        updatedAtEnd,
        page,
        limit,
      };

      return await this.requestsService.findFiltered(params);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving filtered requests',
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get request by ID // Получить заявку по ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Request retrieved successfully.',
    type: RequestResponseDto,
  })
  async getRequestById(@Param('id') id: number): Promise<RequestResponseDto> {
    try {
      const request = await this.requestsService.getRequestById(id);
      return new RequestResponseDto(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving request by ID',
        error.message,
      );
    }
  }

  @Patch(':id/type')
  @ApiOperation({
    summary: 'Update request type // Обновить тип заявки',
  })
  @ApiResponse({
    status: 200,
    description: 'Request type updated successfully.',
    type: RequestResponseDto,
  })
  async updateRequestType(
    @Param('id') id: number,
    @Body() updateRequestTypeDto: UpdateRequestTypeDto,
  ): Promise<RequestResponseDto> {
    try {
      const updatedRequest = await this.requestsService.updateRequestType(
        id,
        updateRequestTypeDto,
      );
      return new RequestResponseDto(updatedRequest);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating request type',
        error.message,
      );
    }
  }

  @Patch(':id/date')
  @ApiOperation({
    summary: 'Update request date // Обновить дату заявки',
  })
  @ApiResponse({
    status: 200,
    description: 'Request date updated successfully.',
    type: RequestResponseDto,
  })
  async updateRequestDate(
    @Param('id') id: number,
    @Body() updateRequestDateDto: UpdateRequestDateDto,
  ): Promise<RequestResponseDto> {
    try {
      const updatedRequest = await this.requestsService.updateRequestDate(
        id,
        updateRequestDateDto,
      );
      return new RequestResponseDto(updatedRequest);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating request date',
        error.message,
      );
    }
  }

  // Новый эндпоинт для отмены заявки
  @Patch(':id/cancel')
  @ApiOperation({
    summary:
      'Cancel request // Отменяем заявку. Добавляется автоматический комментарий "Заявка отменена сотрудником {Имя сотрудника}".',
  })
  async cancelRequest(@Param('id') requestId: number, @Req() req: Request) {
    try {
      await this.requestsService.cancelRequest(
        requestId,
        req.cookies.access_token,
      );
      return { message: 'Request has been cancelled successfully' };
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error cancelling request',
        error.message,
      );
    }
  }

  @Patch(':id/update')
  @ApiOperation({
    summary: 'Update request // Изменить заявку',
  })
  @ApiResponse({
    status: 200,
    description: 'Request updated successfully.',
    type: RequestResponseDto,
  })
  async updateRequest(
    @Param('id') id: number,
    @Body() updateRequestDto: RequestUpdate,
    @Req() req: Request,
  ): Promise<RequestResponseDto> {
    try {
      const updatedRequest = await this.requestsService.updateRequest(
        id,
        updateRequestDto,
        req.cookies.access_token,
      );
      return new RequestResponseDto(updatedRequest);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating request',
        error.message,
      );
    }
  }
}
