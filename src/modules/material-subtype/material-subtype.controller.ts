import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MaterialSubtype } from './material-subtype.entity';
import { MaterialSubtypeService } from './material-subtype.service';
import { CreateMaterialSubtypeDto, UpdateMaterialSubtypeDto } from './material-subtype.dto';

@Controller('material-subtype')
export class MaterialSubtypeController {
  constructor(private readonly materialSubtypeService: MaterialSubtypeService) {}

  @Post()
  async create(@Body() createMaterialSubtypeDto: CreateMaterialSubtypeDto): Promise<MaterialSubtype> {
    return this.materialSubtypeService.create(createMaterialSubtypeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialSubtypeDto: UpdateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    return this.materialSubtypeService.update(id, updateMaterialSubtypeDto);
  }

  @Get()
  async findAll(): Promise<MaterialSubtype[]> {
    return this.materialSubtypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialSubtype> {
    return this.materialSubtypeService.findOne(id);
  }
}
