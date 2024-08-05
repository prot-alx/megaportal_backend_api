import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async findAll(): Promise<Material[]> {
    return this.materialRepository.find({
      relations: ['category', 'type', 'subtype'], // Загрузка связанных сущностей
    });
  }

  async create(data: Partial<Material>): Promise<Material> {
    const newMaterial = this.materialRepository.create(data);
    return this.materialRepository.save(newMaterial);
  }

  async findOne(id: number): Promise<Material> {
    return this.materialRepository.findOne({
      where: { id },
      relations: ['category', 'type', 'subtype'], // Загрузка связанных сущностей
    });
  }

  async update(id: number, data: Partial<Material>): Promise<Material> {
    await this.materialRepository.update(id, data);
    return this.materialRepository.findOne({
      where: { id },
      relations: ['category', 'type', 'subtype'], // Загрузка связанных сущностей
    });
  }
}
