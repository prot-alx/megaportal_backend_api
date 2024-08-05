import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MaterialTypeService } from './material-type.service';
import { MaterialType } from './material-type.entity';

@Controller('material-type')
export class MaterialTypeController {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Get()
  async findAll(): Promise<MaterialType[]> {
    return this.materialTypeService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<MaterialType>): Promise<MaterialType> {
    return this.materialTypeService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialType> {
    return this.materialTypeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MaterialType>): Promise<MaterialType> {
    return this.materialTypeService.update(id, data);
  }
}
