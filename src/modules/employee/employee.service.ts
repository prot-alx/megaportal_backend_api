import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeRole } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = new Employee();

    employee.login = createEmployeeDto.login;
    employee.password = createEmployeeDto.password;
    employee.externalId = createEmployeeDto.externalId;
    employee.name = createEmployeeDto.name;
    employee.address = createEmployeeDto.address;
    employee.phone = createEmployeeDto.phone;
    employee.role = createEmployeeDto.role || EmployeeRole.Performer;
    employee.isActive = createEmployeeDto.isActive !== undefined ? createEmployeeDto.isActive : true;

    return this.employeeRepository.save(employee);
  }

  async findOne(id: number): Promise<Employee> {
    return this.employeeRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
