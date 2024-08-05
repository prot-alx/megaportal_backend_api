import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMaterialCategoryDto, UpdateMaterialCategoryDto } from "./material-category.dto";
import { MaterialCategory } from "./material-category.entity";

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectRepository(MaterialCategory)
    private materialCategoryRepository: Repository<MaterialCategory>,
  ) {}

  async create(createMaterialCategoryDto: CreateMaterialCategoryDto): Promise<MaterialCategory> {
    const materialCategory = this.materialCategoryRepository.create(createMaterialCategoryDto);
    return this.materialCategoryRepository.save(materialCategory);
  }

  async update(id: number, updateMaterialCategoryDto: UpdateMaterialCategoryDto): Promise<MaterialCategory> {
    const materialCategory = await this.materialCategoryRepository.findOne({ where: { id } });
    if (!materialCategory) {
      throw new NotFoundException(`MaterialCategory with ID ${id} not found`);
    }

    Object.assign(materialCategory, updateMaterialCategoryDto);
    return this.materialCategoryRepository.save(materialCategory);
  }

  async findAll(): Promise<MaterialCategory[]> {
    return this.materialCategoryRepository.find();
  }

  async findOne(id: number): Promise<MaterialCategory> {
    const materialCategory = await this.materialCategoryRepository.findOne({ where: { id } });
    if (!materialCategory) {
      throw new NotFoundException(`MaterialCategory with ID ${id} not found`);
    }
    return materialCategory;
  }
}
