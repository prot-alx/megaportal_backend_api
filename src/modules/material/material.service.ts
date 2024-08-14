import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './material.entity';
import { CreateMaterialDto, MaterialDto, UpdateMaterialDto } from './material.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { MaterialCategory } from '../material-category/material-category.entity';
import { MaterialSubtype } from '../material-subtype/material-subtype.entity';
import { MaterialType } from '../material-type/material-type.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  private async isMaterialUnique(
    category_id: number,
    type_id: number,
    subtype_id: number,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.materialRepository
      .createQueryBuilder('material')
      .where('material.category_id = :category_id', { category_id })
      .andWhere('material.type_id = :type_id', { type_id })
      .andWhere('material.subtype_id = :subtype_id', { subtype_id });

    if (excludeId) {
      query.andWhere('material.id != :excludeId', { excludeId });
    }

    const material = await query.getOne();
    return !material;
  }

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const {
      category_id,
      type_id,
      subtype_id,
      sap_number,
      serial,
      inventory_number,
    } = createMaterialDto;

    // Проверка уникальности комбинации полей
    const isUnique = await this.isMaterialUnique(
      category_id,
      type_id,
      subtype_id,
    );
    if (!isUnique) {
      throw new ConflictException(
        'Material with the same combination of category, type, and subtype already exists',
      );
    }

    try {
      // Найти соответствующие объекты по идентификаторам
      const category = await this.materialRepository.manager.findOne(
        MaterialCategory,
        { where: { id: category_id } },
      );
      const type = await this.materialRepository.manager.findOne(MaterialType, {
        where: { id: type_id },
      });
      const subtype = await this.materialRepository.manager.findOne(
        MaterialSubtype,
        { where: { id: subtype_id } },
      );

      if (!category || !type || !subtype) {
        throw new NotFoundException('One or more related entities not found');
      }

      // Создание нового материала
      const material = this.materialRepository.create({
        sap_number,
        serial,
        inventory_number,
        is_active: true, // Устанавливаем значение по умолчанию
        category_id: category,
        type_id: type,
        subtype_id: subtype,
      });

      return await this.materialRepository.save(material);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating material',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    const { category_id, type_id, subtype_id } = updateMaterialDto;

    // Проверка уникальности комбинации полей
    const isUnique = await this.isMaterialUnique(
      category_id,
      type_id,
      subtype_id,
      id,
    );
    if (!isUnique) {
      throw new ConflictException(
        'Material with the same combination of category, type, and subtype already exists',
      );
    }

    Object.assign(material, updateMaterialDto);

    try {
      return await this.materialRepository.save(material);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating material',
        error.message,
      );
    }
  }

  async findAll(): Promise<MaterialDto[]> {
    try {
      const materials = await this.materialRepository.find({
        relations: ['category_id', 'type_id', 'subtype_id'],
      });
      return materials.map((material) => new MaterialDto(material));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving materials',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Material> {
    try {
      const material = await this.materialRepository.findOne({
        where: { id },
        relations: ['category_id', 'type_id', 'subtype_id'],
      });
      if (!material) {
        throw new NotFoundException(`Material with ID ${id} not found`);
      }
      return material;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        `Failed to retrieve material with ID ${id}`,
        error.message,
      );
    }
  }
}
