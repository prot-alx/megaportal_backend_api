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
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Material Type')
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
    try {
      return await this.materialTypeService.create(createMaterialTypeDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating material type',
        error.message,
      );
    }
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
    try {
      return await this.materialTypeService.update(id, updateMaterialTypeDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating material type',
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all types // Для получения всех типов материалов.',
  })
  async findAll(): Promise<MaterialType[]> {
    try {
      return await this.materialTypeService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving material types',
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get type by id // Для получения конкретного материала по id.',
  })
  async findOne(@Param('id') id: number): Promise<MaterialType> {
    try {
      return await this.materialTypeService.findOne(id);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving material type',
        error.message,
      );
    }
  }
}
