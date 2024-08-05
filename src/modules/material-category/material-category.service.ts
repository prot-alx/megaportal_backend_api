import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialCategory } from './material-category.entity';

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectRepository(MaterialCategory)
    private readonly materialCategoryRepository: Repository<MaterialCategory>,
  ) {}

  async findAll(): Promise<MaterialCategory[]> {
    return this.materialCategoryRepository.find();
  }

  async create(data: Partial<MaterialCategory>): Promise<MaterialCategory> {
    const newCategory = this.materialCategoryRepository.create(data);
    return this.materialCategoryRepository.save(newCategory);
  }

  async findOne(id: number): Promise<MaterialCategory> {
    return this.materialCategoryRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<MaterialCategory>): Promise<MaterialCategory> {
    await this.materialCategoryRepository.update(id, data);
    return this.materialCategoryRepository.findOne({ where: { id } });
  }
}
