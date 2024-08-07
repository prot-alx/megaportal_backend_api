import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequestDataService } from './request-data.service';
import { RequestData } from './request-data.entity';
import { CreateRequestDataDto, UpdateRequestDataDto } from './request-data.dto';

@Controller('request-data')
export class RequestDataController {
  constructor(private readonly requestDataService: RequestDataService) {}

  // Эндпоинт для создания новой записи
  @Post()
  async create(
    @Body() createRequestDataDto: CreateRequestDataDto,
  ): Promise<RequestData> {
    return this.requestDataService.create(createRequestDataDto);
  }

  // Эндпоинт для обновления записи по ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRequestDataDto: UpdateRequestDataDto,
  ): Promise<RequestData> {
    return this.requestDataService.update(id, updateRequestDataDto);
  }

  // Эндпоинт для получения всех записей
  @Get()
  async findAll(): Promise<RequestData[]> {
    return this.requestDataService.findAll();
  }

  // Эндпоинт для получения записи по ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RequestData> {
    return this.requestDataService.findOne(id);
  }
}
