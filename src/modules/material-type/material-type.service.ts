import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialType } from './material-type.entity';
import {
  CreateMaterialTypeDto,
  UpdateMaterialTypeDto,
} from './material-type.dto';

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private materialTypeRepository: Repository<MaterialType>,
  ) {}

  async create(
    createMaterialTypeDto: CreateMaterialTypeDto,
  ): Promise<MaterialType> {
    const materialType = this.materialTypeRepository.create(
      createMaterialTypeDto,
    );
    return this.materialTypeRepository.save(materialType);
  }

  async update(
    id: number,
    updateMaterialTypeDto: UpdateMaterialTypeDto,
  ): Promise<MaterialType> {
    const materialType = await this.materialTypeRepository.findOne({
      where: { id },
    });
    if (!materialType) {
      throw new NotFoundException(`MaterialType with ID ${id} not found`);
    }

    materialType.name = updateMaterialTypeDto.name;
    return this.materialTypeRepository.save(materialType);
  }

  async findAll(): Promise<MaterialType[]> {
    return this.materialTypeRepository.find();
  }

  async findOne(id: number): Promise<MaterialType> {
    const materialType = await this.materialTypeRepository.findOne({
      where: { id },
    });
    if (!materialType) {
      throw new NotFoundException(`MaterialType with ID ${id} not found`);
    }
    return materialType;
  }
}
