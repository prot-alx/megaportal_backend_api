import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MaterialService } from './material.service';
import { Material } from './material.entity';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  async findAll(): Promise<Material[]> {
    return this.materialService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Material>): Promise<Material> {
    return this.materialService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Material> {
    return this.materialService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Material>): Promise<Material> {
    return this.materialService.update(id, data);
  }
}
