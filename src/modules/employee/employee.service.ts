import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeRole } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import * as bcrypt from 'bcrypt';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeRepository.find();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving employees',
        error.message,
      );
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const existingEmployee = await this.employeeRepository.findOne({
        where: { login: createEmployeeDto.login },
      });
      if (existingEmployee) {
        throw new ConflictException('Employee with this login already exists');
      }

      const employee = new Employee();
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        createEmployeeDto.password,
        salt,
      );

      employee.login = createEmployeeDto.login;
      employee.password = hashedPassword;
      employee.role = EmployeeRole.Performer;
      employee.is_active = true;

      return await this.employeeRepository.save(employee);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating employee',
        error.message,
      );
    }
  }

  async findByLogin(login: string): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { login },
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      return employee;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving employee',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { id } });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return employee;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving employee',
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { id } });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      if (updateEmployeeDto.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          updateEmployeeDto.password,
          salt,
        );
        updateEmployeeDto.password = hashedPassword;
      }

      Object.assign(employee, updateEmployeeDto);

      return await this.employeeRepository.save(employee);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating employee',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.employeeRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing employee',
        error.message,
      );
    }
  }
}
