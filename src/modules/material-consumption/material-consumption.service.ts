import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialConsumption } from './material-consumption.entity';

@Injectable()
export class MaterialConsumptionService {
  constructor(
    @InjectRepository(MaterialConsumption)
    private readonly materialConsumptionRepository: Repository<MaterialConsumption>,
  ) {}

  async findAll(): Promise<MaterialConsumption[]> {
    return this.materialConsumptionRepository.find();
  }

  async create(data: Partial<MaterialConsumption>): Promise<MaterialConsumption> {
    const newConsumption = this.materialConsumptionRepository.create(data);
    return this.materialConsumptionRepository.save(newConsumption);
  }

  async findOne(id: number): Promise<MaterialConsumption> {
    return this.materialConsumptionRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<MaterialConsumption>): Promise<MaterialConsumption> {
    await this.materialConsumptionRepository.update(id, data);
    return this.materialConsumptionRepository.findOne({ where: { id } });
  }
}
