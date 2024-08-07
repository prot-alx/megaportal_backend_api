import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMaterialSubtypeDto,
  UpdateMaterialSubtypeDto,
} from './material-subtype.dto';
import { MaterialSubtype } from './material-subtype.entity';

@Injectable()
export class MaterialSubtypeService {
  constructor(
    @InjectRepository(MaterialSubtype)
    private materialSubtypeRepository: Repository<MaterialSubtype>,
  ) {}

  async create(
    createMaterialSubtypeDto: CreateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    const materialSubtype = this.materialSubtypeRepository.create(
      createMaterialSubtypeDto,
    );
    return this.materialSubtypeRepository.save(materialSubtype);
  }

  async update(
    id: number,
    updateMaterialSubtypeDto: UpdateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    const materialSubtype = await this.materialSubtypeRepository.findOne({
      where: { id },
    });
    if (!materialSubtype) {
      throw new NotFoundException(`MaterialSubtype with ID ${id} not found`);
    }

    materialSubtype.name = updateMaterialSubtypeDto.name;
    return this.materialSubtypeRepository.save(materialSubtype);
  }

  async findAll(): Promise<MaterialSubtype[]> {
    return this.materialSubtypeRepository.find();
  }

  async findOne(id: number): Promise<MaterialSubtype> {
    const materialSubtype = await this.materialSubtypeRepository.findOne({
      where: { id },
    });
    if (!materialSubtype) {
      throw new NotFoundException(`MaterialSubtype with ID ${id} not found`);
    }
    return materialSubtype;
  }
}
