import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MaterialTypeService } from './material-type.service';
import { MaterialType } from './material-type.entity';
import { CreateMaterialTypeDto, UpdateMaterialTypeDto } from './material-type.dto';

@Controller('material-type')
export class MaterialTypeController {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Post()
  async create(@Body() createMaterialTypeDto: CreateMaterialTypeDto): Promise<MaterialType> {
    return this.materialTypeService.create(createMaterialTypeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialTypeDto: UpdateMaterialTypeDto,
  ): Promise<MaterialType> {
    return this.materialTypeService.update(id, updateMaterialTypeDto);
  }

  @Get()
  async findAll(): Promise<MaterialType[]> {
    return this.materialTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialType> {
    return this.materialTypeService.findOne(id);
  }
}
