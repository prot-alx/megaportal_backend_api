import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { WarehouseFillingService } from './warehouse-filling.service';
import { WarehouseFilling } from './warehouse-filling.entity';

@Controller('warehouse-filling')
export class WarehouseFillingController {
  constructor(private readonly warehouseFillingService: WarehouseFillingService) {}

  @Get()
  async findAll(): Promise<WarehouseFilling[]> {
    return this.warehouseFillingService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<WarehouseFilling>): Promise<WarehouseFilling> {
    return this.warehouseFillingService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<WarehouseFilling> {
    return this.warehouseFillingService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<WarehouseFilling>): Promise<WarehouseFilling> {
    return this.warehouseFillingService.update(id, data);
  }
}
