import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialType } from './material-type.entity';
import {
  CreateMaterialTypeDto,
  UpdateMaterialTypeDto,
} from './material-type.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class MaterialTypeService {
  constructor(
    @InjectRepository(MaterialType)
    private readonly materialTypeRepository: Repository<MaterialType>,
  ) {}

  async create(
    createMaterialTypeDto: CreateMaterialTypeDto,
  ): Promise<MaterialType> {
    try {
      const materialType = this.materialTypeRepository.create(
        createMaterialTypeDto,
      );
      return await this.materialTypeRepository.save(materialType);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating material type',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateMaterialTypeDto: UpdateMaterialTypeDto,
  ): Promise<MaterialType> {
    try {
      const materialType = await this.materialTypeRepository.findOne({
        where: { id },
      });
      if (!materialType) {
        throw new NotFoundException(`MaterialType with ID ${id} not found`);
      }

      materialType.name = updateMaterialTypeDto.name;
      return await this.materialTypeRepository.save(materialType);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DetailedInternalServerErrorException(
        'Error updating material type',
        error.message,
      );
    }
  }

  async findAll(): Promise<MaterialType[]> {
    try {
      return await this.materialTypeRepository.find();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving material types',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<MaterialType> {
    try {
      const materialType = await this.materialTypeRepository.findOne({
        where: { id },
      });
      if (!materialType) {
        throw new NotFoundException(`MaterialType with ID ${id} not found`);
      }
      return materialType;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving material type',
        error.message,
      );
    }
  }
}
