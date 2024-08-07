import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { WarehouseFillingService } from './warehouse-filling.service';
import { WarehouseFilling } from './warehouse-filling.entity';
import {
  CreateWarehouseFillingDto,
  UpdateWarehouseFillingDto,
} from './warehouse-filling.dto';

@Controller('warehouse-filling')
export class WarehouseFillingController {
  constructor(
    private readonly warehouseFillingService: WarehouseFillingService,
  ) {}

  // Эндпоинт для создания новой записи
  @Post()
  async create(
    @Body() createWarehouseFillingDto: CreateWarehouseFillingDto,
  ): Promise<WarehouseFilling> {
    return this.warehouseFillingService.create(createWarehouseFillingDto);
  }

  // Эндпоинт для обновления записи по ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWarehouseFillingDto: UpdateWarehouseFillingDto,
  ): Promise<WarehouseFilling> {
    return this.warehouseFillingService.update(id, updateWarehouseFillingDto);
  }

  // Эндпоинт для получения всех записей
  @Get()
  async findAll(): Promise<WarehouseFilling[]> {
    return this.warehouseFillingService.findAll();
  }

  // Эндпоинт для получения записи по ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<WarehouseFilling> {
    return this.warehouseFillingService.findOne(id);
  }
}
