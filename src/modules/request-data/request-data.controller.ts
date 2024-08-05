import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequestDataService } from './request-data.service';
import { RequestData } from './request-data.entity';

@Controller('request-data')
export class RequestDataController {
  constructor(private readonly requestDataService: RequestDataService) {}

  @Get()
  async findAll(): Promise<RequestData[]> {
    return this.requestDataService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<RequestData>): Promise<RequestData> {
    return this.requestDataService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<RequestData> {
    return this.requestDataService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<RequestData>): Promise<RequestData> {
    return this.requestDataService.update(id, data);
  }
}
