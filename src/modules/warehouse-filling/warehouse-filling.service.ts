import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseFilling } from './warehouse-filling.entity';

@Injectable()
export class WarehouseFillingService {
  constructor(
    @InjectRepository(WarehouseFilling)
    private readonly warehouseFillingRepository: Repository<WarehouseFilling>,
  ) {}

  async findAll(): Promise<WarehouseFilling[]> {
    return this.warehouseFillingRepository.find();
  }

  async create(data: Partial<WarehouseFilling>): Promise<WarehouseFilling> {
    const newWarehouseFilling = this.warehouseFillingRepository.create(data);
    return this.warehouseFillingRepository.save(newWarehouseFilling);
  }

  async findOne(id: number): Promise<WarehouseFilling> {
    return this.warehouseFillingRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<WarehouseFilling>): Promise<WarehouseFilling> {
    await this.warehouseFillingRepository.update(id, data);
    return this.warehouseFillingRepository.findOne({ where: { id } });
  }
}
