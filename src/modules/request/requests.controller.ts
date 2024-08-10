import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './request.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Request')
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
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestsService.create(createRequestDto, token);
  }

  @Get('me')
  @ApiOperation({
    summary:
      'Тестовый эндпоинт для проверки получения токена пользователя. Удалить перед релизом',
  })
  async getCurrentUser(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.requestsService.getCurrentUser(token);
  }

  @Get()
  @ApiOperation({
    summary:
      'Show all requests // Отобразить все заявки. Без фильтров статусов, дат, типов, и прочих других. Вообще все заявки. Добавить фильтры потом',
  })
  async findAll() {
    return this.requestsService.findAll();
  }
}
