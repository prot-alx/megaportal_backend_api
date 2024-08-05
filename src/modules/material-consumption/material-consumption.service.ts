import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialConsumption } from './material-consumption.entity';
import { CreateMaterialConsumptionDto, UpdateMaterialConsumptionDto } from './material-consumption.dto';

@Injectable()
export class MaterialConsumptionService {
  constructor(
    @InjectRepository(MaterialConsumption)
    private materialConsumptionRepository: Repository<MaterialConsumption>,
  ) {}

  async create(createMaterialConsumptionDto: CreateMaterialConsumptionDto): Promise<MaterialConsumption> {
    const materialConsumption = this.materialConsumptionRepository.create(createMaterialConsumptionDto);
    return this.materialConsumptionRepository.save(materialConsumption);
  }

  async update(id: number, updateMaterialConsumptionDto: UpdateMaterialConsumptionDto): Promise<MaterialConsumption> {
    const materialConsumption = await this.materialConsumptionRepository.findOne({ where: { id } });
    if (!materialConsumption) {
      throw new NotFoundException(`MaterialConsumption with ID ${id} not found`);
    }

    // Only update the approved field
    materialConsumption.approved = updateMaterialConsumptionDto.approved;
    return this.materialConsumptionRepository.save(materialConsumption);
  }

  async findAll(): Promise<MaterialConsumption[]> {
    return this.materialConsumptionRepository.find();
  }

  async findOne(id: number): Promise<MaterialConsumption> {
    const materialConsumption = await this.materialConsumptionRepository.findOne({ where: { id } });
    if (!materialConsumption) {
      throw new NotFoundException(`MaterialConsumption with ID ${id} not found`);
    }
    return materialConsumption;
  }
}
