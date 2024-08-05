import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { MaterialConsumptionService } from './material-consumption.service';
import { MaterialConsumption } from './material-consumption.entity';
import { CreateMaterialConsumptionDto, UpdateMaterialConsumptionDto } from './material-consumption.dto';

@Controller('material-consumption')
export class MaterialConsumptionController {
  constructor(private readonly materialConsumptionService: MaterialConsumptionService) {}

  @Post()
  async create(@Body() createMaterialConsumptionDto: CreateMaterialConsumptionDto): Promise<MaterialConsumption> {
    return this.materialConsumptionService.create(createMaterialConsumptionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialConsumptionDto: UpdateMaterialConsumptionDto,
  ): Promise<MaterialConsumption> {
    return this.materialConsumptionService.update(id, updateMaterialConsumptionDto);
  }

  @Get()
  async findAll(): Promise<MaterialConsumption[]> {
    return this.materialConsumptionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialConsumption> {
    return this.materialConsumptionService.findOne(id);
  }
}
