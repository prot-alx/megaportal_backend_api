import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseFilling } from './warehouse-filling.entity';
import { Material } from '../material/material.entity';
import { CreateWarehouseFillingDto, UpdateWarehouseFillingDto } from './warehouse-filling.dto';

@Injectable()
export class WarehouseFillingService {
  constructor(
    @InjectRepository(WarehouseFilling)
    private readonly warehouseFillingRepository: Repository<WarehouseFilling>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>
  ) {}

  // Метод для создания записи о наличии материала на складе
  async create(createWarehouseFillingDto: CreateWarehouseFillingDto): Promise<WarehouseFilling> {
    const { materialId, count } = createWarehouseFillingDto;

    // Проверка существования материала
    const material = await this.materialRepository.findOne({
      where: { id: materialId }
    });
    if (!material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }

    const newWarehouseFilling = this.warehouseFillingRepository.create({
      material,
      count
    });

    return await this.warehouseFillingRepository.save(newWarehouseFilling);
  }

  // Метод для обновления записи о наличии материала на складе
  async update(id: number, updateWarehouseFillingDto: UpdateWarehouseFillingDto): Promise<WarehouseFilling> {
    const warehouseFilling = await this.warehouseFillingRepository.findOne({
      where: { id }
    });

    if (!warehouseFilling) {
      throw new NotFoundException(`WarehouseFilling with ID ${id} not found`);
    }

    const { materialId, count } = updateWarehouseFillingDto;

    // Обновление материала, если он передан
    const material = materialId ? await this.materialRepository.findOne({ where: { id: materialId } }) : warehouseFilling.material;
    if (materialId && !material) {
      throw new NotFoundException(`Material with ID ${materialId} not found`);
    }

    this.warehouseFillingRepository.merge(warehouseFilling, {
      material,
      count
    });

    return await this.warehouseFillingRepository.save(warehouseFilling);
  }

  // Метод для получения всех записей
  async findAll(): Promise<WarehouseFilling[]> {
    return this.warehouseFillingRepository.find({ relations: ['material'] });
  }

  // Метод для получения записи по ID
  async findOne(id: number): Promise<WarehouseFilling> {
    const warehouseFilling = await this.warehouseFillingRepository.findOne({
      where: { id },
      relations: ['material']
    });

    if (!warehouseFilling) {
      throw new NotFoundException(`WarehouseFilling with ID ${id} not found`);
    }

    return warehouseFilling;
  }

  // Метод для удаления записи по ID
  async remove(id: number): Promise<void> {
    const result = await this.warehouseFillingRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`WarehouseFilling with ID ${id} not found`);
    }
  }
}