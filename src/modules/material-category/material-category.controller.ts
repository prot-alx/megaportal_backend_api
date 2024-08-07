import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategory } from './material-category.entity';
import {
  CreateMaterialCategoryDto,
  UpdateMaterialCategoryDto,
} from './material-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('material-category')
@Controller('material-category')
export class MaterialCategoryController {
  constructor(
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary:
      'Create a new category // Для создания новой категории. Например, "Расходники", "Оборудование", "Инвентарь". Глобальные сущности, разделяющие весь материал. Для уточнения использовать таблицы type и subtype.',
  })
  async create(
    @Body() createMaterialCategoryDto: CreateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary:
      'Update a category // Для редактирования названия существующей категории (по id)',
  })
  async update(
    @Param('id') id: number,
    @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    return this.materialCategoryService.update(id, updateMaterialCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all categories // Получить все категории' })
  async findAll(): Promise<MaterialCategory[]> {
    return this.materialCategoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary:
      'Get one category by ID // Получить одну конкретную категорию по ID',
  })
  async findOne(@Param('id') id: number): Promise<MaterialCategory> {
    return this.materialCategoryService.findOne(id);
  }
}
