import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MaterialSubtypeService } from './material-subtype.service';
import { MaterialSubtype } from './material-subtype.entity';

@Controller('material-subtype')
export class MaterialSubtypeController {
  constructor(private readonly materialSubtypeService: MaterialSubtypeService) {}

  @Get()
  async findAll(): Promise<MaterialSubtype[]> {
    return this.materialSubtypeService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<MaterialSubtype>): Promise<MaterialSubtype> {
    return this.materialSubtypeService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialSubtype> {
    return this.materialSubtypeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MaterialSubtype>): Promise<MaterialSubtype> {
    return this.materialSubtypeService.update(id, data);
  }
}
