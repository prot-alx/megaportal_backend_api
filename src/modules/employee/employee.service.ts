import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeRole } from './employee.entity';
import {
  CreateEmployeeDto,
  EmployeeSummaryDto,
  UpdateEmployeeDto,
} from './employee.dto';
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
        'Ошибка получения данных о сотрудниках.',
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
        throw new NotFoundException('Ошибка данных.');
      }
      return employee;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Неверный логин или пароль.',
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Employee> {
    console.log('Вызов метода findOne с id:', id);
    try {
      const employee = await this.employeeRepository.findOne({ where: { id } });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      return employee;
    } catch (error) {
      console.error('Ошибка в методе findOne:', error.message);
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотруднике. 123',
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

  // Метод для поиска активных сотрудников по ролям
  async findByRoles(roles: EmployeeRole[]): Promise<EmployeeSummaryDto[]> {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder('employee');

      queryBuilder
        .where('employee.role IN (:...roles)', { roles })
        .andWhere('employee.is_active = :is_active', { is_active: true });

      const employees = await queryBuilder.getMany();

      return employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
      }));
    } catch (error) {
      console.error('Error in findByRoles:', error); // Логируем ошибку
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотрудниках.',
        error.message,
      );
    }
  }
}
