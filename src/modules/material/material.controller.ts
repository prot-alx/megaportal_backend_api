import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MaterialService } from './material.service';
import { Material } from './material.entity';
import { CreateMaterialDto, UpdateMaterialDto } from './material.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() createMaterialDto: CreateMaterialDto): Promise<Material> {
    return this.materialService.create(createMaterialDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Get()
  async findAll(): Promise<Material[]> {
    return this.materialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Material> {
    return this.materialService.findOne(id);
  }
}
