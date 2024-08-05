import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackpackEmployee } from './backpack-employee.entity';
import { CreateBackpackEmployeeDto, UpdateBackpackEmployeeDto } from './backpack-employee.dto';

@Injectable()
export class BackpackEmployeeService {
  constructor(
    @InjectRepository(BackpackEmployee)
    private backpackEmployeeRepository: Repository<BackpackEmployee>,
  ) {}

  async create(createBackpackEmployeeDto: CreateBackpackEmployeeDto): Promise<BackpackEmployee> {
    const backpackEmployee = this.backpackEmployeeRepository.create(createBackpackEmployeeDto);
    return this.backpackEmployeeRepository.save(backpackEmployee);
  }

  async update(id: number, updateBackpackEmployeeDto: UpdateBackpackEmployeeDto): Promise<BackpackEmployee> {
    const backpackEmployee = await this.backpackEmployeeRepository.findOne({ where: { id } });
    if (!backpackEmployee) {
      throw new NotFoundException(`BackpackEmployee with ID ${id} not found`);
    }

    Object.assign(backpackEmployee, updateBackpackEmployeeDto);
    return this.backpackEmployeeRepository.save(backpackEmployee);
  }
}
