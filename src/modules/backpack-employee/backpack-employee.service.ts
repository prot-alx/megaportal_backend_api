import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackpackEmployee } from './backpack-employee.entity';

@Injectable()
export class BackpackEmployeeService {
  constructor(
    @InjectRepository(BackpackEmployee)
    private readonly backpackEmployeeRepository: Repository<BackpackEmployee>,
  ) {}

  // Пример метода для получения всех записей
  async findAll(): Promise<BackpackEmployee[]> {
    return this.backpackEmployeeRepository.find();
  }

  // Пример метода для создания новой записи
  async create(data: Partial<BackpackEmployee>): Promise<BackpackEmployee> {
    const newBackpackEmployee = this.backpackEmployeeRepository.create(data);
    return this.backpackEmployeeRepository.save(newBackpackEmployee);
  }

  // Пример метода для обновления записи
  async update(id: number, data: Partial<BackpackEmployee>): Promise<BackpackEmployee> {
    await this.backpackEmployeeRepository.update(id, data);
    return this.backpackEmployeeRepository.findOne({ where: { id } });
  }
}
