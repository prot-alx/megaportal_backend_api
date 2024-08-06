import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MaterialSubtype } from './material-subtype.entity';
import { MaterialSubtypeService } from './material-subtype.service';
import { CreateMaterialSubtypeDto, UpdateMaterialSubtypeDto } from './material-subtype.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('material-subtype')
@Controller('material-subtype')
export class MaterialSubtypeController {
  constructor(private readonly materialSubtypeService: MaterialSubtypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subtype // Для создания новой подкатегории (модели). Например, точная маркировка кабеля, тип коннекторов, конкретная модель ONT, конкретная модель STB. Точное название из SAP' })
  async create(@Body() createMaterialSubtypeDto: CreateMaterialSubtypeDto): Promise<MaterialSubtype> {
    return this.materialSubtypeService.create(createMaterialSubtypeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subtype // Для редактирования названия подкатегории (модели) по id' })
  async update(
    @Param('id') id: number,
    @Body() updateMaterialSubtypeDto: UpdateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    return this.materialSubtypeService.update(id, updateMaterialSubtypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subtypes // Получить все подтипы' })
  async findAll(): Promise<MaterialSubtype[]> {
    return this.materialSubtypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subtype by id // Получить подтип по id' })
  async findOne(@Param('id') id: number): Promise<MaterialSubtype> {
    return this.materialSubtypeService.findOne(id);
  }
}
