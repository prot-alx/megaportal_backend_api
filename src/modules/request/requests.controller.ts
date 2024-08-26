import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto, RequestResponseDto } from './request.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { RequestStatus } from './requests.entity';

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
    summary:
      'Get filtered requests // Получить заявки с фильтрацией по статусу',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered requests retrieved successfully.',
    type: [RequestResponseDto],
  })
  async findFiltered(
    @Query('status') status?: RequestStatus,
  ): Promise<RequestResponseDto[]> {
    try {
      return await this.requestsService.findFiltered(status);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving filtered requests',
        error.message,
      );
    }
  }
}
