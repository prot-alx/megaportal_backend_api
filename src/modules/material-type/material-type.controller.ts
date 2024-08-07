import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MaterialTypeService } from './material-type.service';
import { MaterialType } from './material-type.entity';
import {
  CreateMaterialTypeDto,
  UpdateMaterialTypeDto,
} from './material-type.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('material-type')
@Controller('material-type')
@UseGuards(AuthGuard('jwt'))
export class MaterialTypeController {
  constructor(private readonly materialTypeService: MaterialTypeService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new type // Для создания нового типа материала, некая обобщающая сущность. Например, ONT, STB, Кабель, Коннектор. Для точного названия использовать таблицу subtype',
  })
  async create(
    @Body() createMaterialTypeDto: CreateMaterialTypeDto,
  ): Promise<MaterialType> {
    return this.materialTypeService.create(createMaterialTypeDto);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Update a type // Для изменения названия существующего типа материала.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateMaterialTypeDto: UpdateMaterialTypeDto,
  ): Promise<MaterialType> {
    return this.materialTypeService.update(id, updateMaterialTypeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all types // Для получения всех типов материалов.',
  })
  async findAll(): Promise<MaterialType[]> {
    return this.materialTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get type by id // Для получения конкретного материала по id.',
  })
  async findOne(@Param('id') id: number): Promise<MaterialType> {
    return this.materialTypeService.findOne(id);
  }
}
