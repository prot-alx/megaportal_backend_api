import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async create(data: Partial<Employee>): Promise<Employee> {
    const newEmployee = this.employeeRepository.create(data);
    return this.employeeRepository.save(newEmployee);
  }

  async findOne(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    await this.employeeRepository.update(id, data);
    return this.employeeRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
