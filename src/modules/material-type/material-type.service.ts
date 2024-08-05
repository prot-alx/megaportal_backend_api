import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialType } from './material-type.entity';

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private readonly materialTypeRepository: Repository<MaterialType>,
  ) {}

  async findAll(): Promise<MaterialType[]> {
    return this.materialTypeRepository.find();
  }

  async create(data: Partial<MaterialType>): Promise<MaterialType> {
    const newMaterialType = this.materialTypeRepository.create(data);
    return this.materialTypeRepository.save(newMaterialType);
  }

  async findOne(id: number): Promise<MaterialType> {
    return this.materialTypeRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<MaterialType>): Promise<MaterialType> {
    await this.materialTypeRepository.update(id, data);
    return this.materialTypeRepository.findOne({ where: { id } });
  }
}
