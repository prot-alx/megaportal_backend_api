import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests } from './requests.entity';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto): Promise<Requests> {
    return this.requestsService.create(createRequestDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRequestDto: UpdateRequestDto,
  ): Promise<Requests> {
    return this.requestsService.update(id, updateRequestDto);
  }

  @Get()
  async findAll(): Promise<Requests[]> {
    return this.requestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Requests> {
    return this.requestsService.findOne(id);
  }
}
