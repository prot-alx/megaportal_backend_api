import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMaterialSubtypeDto,
  UpdateMaterialSubtypeDto,
} from './material-subtype.dto';
import { MaterialSubtype } from './material-subtype.entity';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class MaterialSubtypeService {
  constructor(
    @InjectRepository(MaterialSubtype)
    private readonly materialSubtypeRepository: Repository<MaterialSubtype>,
  ) {}

  async create(
    createMaterialSubtypeDto: CreateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    try {
      const materialSubtype = this.materialSubtypeRepository.create(
        createMaterialSubtypeDto,
      );
      return await this.materialSubtypeRepository.save(materialSubtype);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Failed to create material subtype',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateMaterialSubtypeDto: UpdateMaterialSubtypeDto,
  ): Promise<MaterialSubtype> {
    try {
      const materialSubtype = await this.materialSubtypeRepository.findOne({
        where: { id },
      });
      if (!materialSubtype) {
        throw new NotFoundException(`MaterialSubtype with ID ${id} not found`);
      }

      materialSubtype.name = updateMaterialSubtypeDto.name;
      return await this.materialSubtypeRepository.save(materialSubtype);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Failed to update material subtype with ID ${id}`,
        error.message,
      );
    }
  }

  async findAll(): Promise<MaterialSubtype[]> {
    try {
      return await this.materialSubtypeRepository.find();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Failed to retrieve material subtypes',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<MaterialSubtype> {
    try {
      const materialSubtype = await this.materialSubtypeRepository.findOne({
        where: { id },
      });
      if (!materialSubtype) {
        throw new NotFoundException(`MaterialSubtype with ID ${id} not found`);
      }
      return materialSubtype;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Failed to retrieve material subtype with ID ${id}`,
        error.message,
      );
    }
  }
}
