import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMaterialCategoryDto,
  UpdateMaterialCategoryDto,
} from './material-category.dto';
import { MaterialCategory } from './material-category.entity';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectRepository(MaterialCategory)
    private readonly materialCategoryRepository: Repository<MaterialCategory>,
  ) {}

  async create(
    createMaterialCategoryDto: CreateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory = this.materialCategoryRepository.create(
        createMaterialCategoryDto,
      );
      return this.materialCategoryRepository.save(materialCategory);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating material category',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory = await this.materialCategoryRepository.findOne({
        where: { id },
      });
      if (!materialCategory) {
        throw new NotFoundException(`MaterialCategory with ID ${id} not found`);
      }

      Object.assign(materialCategory, updateMaterialCategoryDto);
      return this.materialCategoryRepository.save(materialCategory);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating material category',
        error.message,
      );
    }
  }

  async findAll(): Promise<MaterialCategory[]> {
    try {
      return await this.materialCategoryRepository.find();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error finding material categories',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<MaterialCategory> {
    try {
      const materialCategory = await this.materialCategoryRepository.findOne({
        where: { id },
      });
      if (!materialCategory) {
        throw new NotFoundException(`MaterialCategory with ID ${id} not found`);
      }
      return materialCategory;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Error finding material category with ID ${id}`,
        error.message,
      );
    }
  }
}
