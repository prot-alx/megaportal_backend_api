import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { MaterialConsumptionService } from './material-consumption.service';
import { MaterialConsumption } from './material-consumption.entity';

@Controller('material-consumption')
export class MaterialConsumptionController {
  constructor(private readonly materialConsumptionService: MaterialConsumptionService) {}

  @Get()
  async findAll(): Promise<MaterialConsumption[]> {
    return this.materialConsumptionService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<MaterialConsumption>): Promise<MaterialConsumption> {
    return this.materialConsumptionService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialConsumption> {
    return this.materialConsumptionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MaterialConsumption>): Promise<MaterialConsumption> {
    return this.materialConsumptionService.update(id, data);
  }
}
