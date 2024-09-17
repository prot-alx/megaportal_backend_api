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
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestDataService } from './request-data.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import {
  ChangeRequestStatusDto,
  CreateRequestDto,
  RequestDataDto,
  RequestDataResponseDto,
  RequestFilterDto,
} from './request-data.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { AddCommentDto } from '../request/request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeDto } from '../employee/employee.dto';

@ApiTags('Request-Data')
@ApiBearerAuth()
@Controller('request-data')
@UseGuards(AuthGuard('jwt'))
export class RequestDataController {
  constructor(
    private readonly requestDataService: RequestDataService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую заявку' })
  @ApiResponse({
    status: 201,
    description: 'Заявка успешно создана',
    type: RequestDataResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async createRequest(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    // Извлекаем токен из заголовков
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    return await this.requestDataService.create(createRequestDto, token);
  }

  // Назначаем заявку
  //@Roles(EmployeeRole.Dispatcher)
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

  // Смотрим назначенные на себя заявки
  @Get('/assigned')
  @ApiOperation({
    summary: 'Check requests // Смотрим все назначенные заявки',
  })
  async getAssignedRequests(
    @Req() req: Request,
  ): Promise<RequestDataResponseDto[]> {
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
    @Req() req: Request, // Добавляем запрос, чтобы можно было проверить токен
  ) {
    try {
      // Извлечение токена из заголовка Authorization
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

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
      'Change request status// Меняем статус. Нельзя ставить CLOSED или CANCELLED через этот эндпоинт. Для этого есть отдельные прописанные эндпоинты.',
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
      'Show all request data // Отобразить все данные по заявкам, включая исполнителей и сотрудников, назначивших заявки.',
  })
  @ApiResponse({
    status: 200,
    description: 'All request data retrieved successfully.',
    type: [RequestDataResponseDto],
  })
  async findAll(): Promise<RequestDataResponseDto[]> {
    try {
      return await this.requestDataService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving request data',
        error.message,
      );
    }
  }

  // Получение общего списка исполнителей
  @Get('employees')
  @ApiOperation({
    summary: 'Get all employees // Получить список всех сотрудников',
  })
  async getAllEmployees(@Req() req: Request): Promise<EmployeeDto[]> {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getAllEmployees();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving employees',
        error.message,
      );
    }
  }

  // Получение назначенных на конкретную заявку исполнителей
  @Get(':requestId/performers')
  @ApiOperation({
    summary:
      'Get performers for request // Получить исполнителей для конкретной заявки',
  })
  async getPerformersForRequest(
    @Param('requestId') requestId: number,
    @Req() req: Request,
  ): Promise<EmployeeDto[]> {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getPerformersForRequest(requestId);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving performers for request',
        error.message,
      );
    }
  }

  // Получение списка всех заявок и соответствующих исполнителей
  @Get('requests')
  @ApiOperation({
    summary:
      'Get all requests and performers // Получить все заявки и соответствующих исполнителей',
  })
  async getRequestsAndPerformers(
    @Req() req: Request,
  ): Promise<RequestDataResponseDto[]> {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getRequestsAndPerformers();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests and performers',
        error.message,
      );
    }
  }

  @Patch(':requestId/performer')
  @ApiOperation({
    summary: 'Assign or replace performer in a request',
  })
  async assignOrReplacePerformer(
    @Param('requestId') requestId: number,
    @Body() body: { newPerformerId: number; currentPerformerId?: number },
    @Req() req: Request,
  ) {
    try {
      // Извлечение токена из заголовка Authorization
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

      const { newPerformerId, currentPerformerId } = body;

      if (currentPerformerId !== undefined) {
        await this.requestDataService.replacePerformer(
          requestId,
          currentPerformerId,
          newPerformerId,
          token,
        );
      } else {
        await this.requestDataService.assignRequest(
          requestId,
          newPerformerId,
          token,
        );
      }

      return { message: 'Performer assigned or replaced successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Error assigning or replacing performer: ${error.message}`,
        );
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          `Error assigning or replacing performer: ${error.message}`,
        );
      } else {
        throw new DetailedInternalServerErrorException(
          'Error assigning or replacing performer',
          error.message,
        );
      }
    }
  }

  @Get('filtered')
  @ApiOperation({
    summary: 'Получить все заявки с фильтрацией и пагинацией',
  })
  async getRequests(
    @Query() filterDto: RequestFilterDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getRequestsWithFilters(filterDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests with filters',
        error.message,
      );
    }
  }
}
