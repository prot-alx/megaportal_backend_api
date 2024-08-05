import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategory } from './material-category.entity';

@Controller('material-category')
export class MaterialCategoryController {
  constructor(private readonly materialCategoryService: MaterialCategoryService) {}

  @Get()
  async findAll(): Promise<MaterialCategory[]> {
    return this.materialCategoryService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<MaterialCategory>): Promise<MaterialCategory> {
    return this.materialCategoryService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MaterialCategory> {
    return this.materialCategoryService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<MaterialCategory>): Promise<MaterialCategory> {
    return this.materialCategoryService.update(id, data);
  }
}
