import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialSubtype } from './material-subtype.entity';

@Injectable()
export class MaterialSubtypeService {
  constructor(
    @InjectRepository(MaterialSubtype)
    private readonly materialSubtypeRepository: Repository<MaterialSubtype>,
  ) {}

  async findAll(): Promise<MaterialSubtype[]> {
    return this.materialSubtypeRepository.find();
  }

  async create(data: Partial<MaterialSubtype>): Promise<MaterialSubtype> {
    const newMaterialSubtype = this.materialSubtypeRepository.create(data);
    return this.materialSubtypeRepository.save(newMaterialSubtype);
  }

  async findOne(id: number): Promise<MaterialSubtype> {
    return this.materialSubtypeRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<MaterialSubtype>): Promise<MaterialSubtype> {
    await this.materialSubtypeRepository.update(id, data);
    return this.materialSubtypeRepository.findOne({ where: { id } });
  }
}
