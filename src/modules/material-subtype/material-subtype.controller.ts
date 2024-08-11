import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MaterialSubtype } from './material-subtype.entity';
import { MaterialSubtypeService } from './material-subtype.service';
import {
  CreateMaterialSubtypeDto,
  UpdateMaterialSubtypeDto,
} from './material-subtype.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Material Subtype')
@ApiBearerAuth()
@Controller('material-subtype')
@UseGuards(AuthGuard('jwt'))
export class MaterialSubtypeController {
  constructor(
    private readonly materialSubtypeService: MaterialSubtypeService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new subtype // Для создания новой подкатегории (модели). Например, точная маркировка кабеля, тип коннекторов, конкретная модель ONT, конкретная модель STB. Точное название из SAP',
  })
  async create(
    @Body() createMaterialSubtypeDto: CreateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    try {
      return await this.materialSubtypeService.create(createMaterialSubtypeDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Failed to create material subtype',
        error.message,
      );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Update a subtype // Для редактирования названия подкатегории (модели) по id',
  })
  async update(
    @Param('id') id: number,
    @Body() updateMaterialSubtypeDto: UpdateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    try {
      return await this.materialSubtypeService.update(
        id,
        updateMaterialSubtypeDto,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Failed to update material subtype with ID ${id}`,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all subtypes // Получить все подтипы' })
  async findAll(): Promise<MaterialSubtype[]> {
    try {
      return await this.materialSubtypeService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Failed to retrieve material subtypes',
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subtype by id // Получить подтип по id' })
  async findOne(@Param('id') id: number): Promise<MaterialSubtype> {
    try {
      return await this.materialSubtypeService.findOne(id);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Failed to retrieve material subtype with ID ${id}`,
        error.message,
      );
    }
  }
}
