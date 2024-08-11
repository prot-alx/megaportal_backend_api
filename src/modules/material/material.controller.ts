import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto, UpdateMaterialDto } from './material.dto';
import { Material } from './material.entity';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Material')
@Controller('material')
@UseGuards(AuthGuard('jwt'))
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new material // Создать новый материал. При существовании такого же создать копию нельзя, необходимо работать с существующим, например, отредактировать через PUT.',
  })
  @ApiBody({ type: CreateMaterialDto })
  @ApiResponse({
    status: 201,
    description: 'Material created successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(
    @Body() createMaterialDto: CreateMaterialDto,
  ): Promise<Material> {
    try {
      return await this.materialService.create(createMaterialDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating material',
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all materials // Вывести список всех материалов',
  })
  @ApiResponse({
    status: 200,
    description: 'List of materials',
    type: [Material],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<Material[]> {
    try {
      return await this.materialService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving materials',
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material by ID // Просмотр материала по ID' })
  @ApiResponse({ status: 200, description: 'Material details', type: Material })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: number): Promise<Material> {
    try {
      return await this.materialService.findOne(id);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving material',
        error.message,
      );
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a material by ID // Изменить материал по ID',
  })
  @ApiBody({ type: UpdateMaterialDto })
  @ApiResponse({
    status: 200,
    description: 'Material updated successfully',
    type: Material,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id') id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    try {
      return await this.materialService.update(id, updateMaterialDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating material',
        error.message,
      );
    }
  }
}
