import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategory } from './material-category.entity';
import { CreateMaterialCategoryDto, UpdateMaterialCategoryDto } from './material-category.dto';

@Controller('material-category')
export class MaterialCategoryController {
  constructor(private readonly materialCategoryService: MaterialCategoryService) {}

  @Post()
  async create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto): Promise<MaterialCategory> {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    return this.materialCategoryService.update(id, updateMaterialCategoryDto);
  }

  @Get()
  async findAll(): Promise<MaterialCategory[]> {
    return this.materialCategoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialCategory> {
    return this.materialCategoryService.findOne(id);
  }
}
