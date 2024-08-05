import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests } from './requests.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async findAll(): Promise<Requests[]> {
    return this.requestsService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Requests>): Promise<Requests> {
    return this.requestsService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Requests> {
    return this.requestsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Requests>): Promise<Requests> {
    return this.requestsService.update(id, data);
  }
}
