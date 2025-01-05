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
  EmployeeDto,
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

  async findAll(filterDto: EmployeeDto): Promise<Employee[]> {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder('employee');

      // Фильтрация по ролям
      if (filterDto.role) {
        const rolesArray = filterDto.role.split(','); // Предполагаем, что roles передаются как строка через запятую
        queryBuilder.andWhere('employee.role IN (:...roles)', {
          roles: rolesArray,
        });
      }

      // Фильтрация по активности
      if (filterDto.is_active !== undefined) {
        queryBuilder.andWhere('employee.is_active = :is_active', {
          is_active: filterDto.is_active,
        });
      }

      // Сортировка по имени
      queryBuilder.orderBy('employee.name', 'ASC');

      return await queryBuilder.getMany();
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

  //
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

  // Метод для поиска сотрудников по ролям с учетом активности
  async findByRoles(
    roles: EmployeeRole[],
    isActive: boolean | undefined,
  ): Promise<EmployeeDto[]> {
    try {
      const queryBuilder =
        this.employeeRepository.createQueryBuilder('employee');

      // Применяем фильтр по ролям, если roles не пуст
      if (roles.length > 0) {
        queryBuilder.where('employee.role IN (:...roles)', { roles });
      }

      // Применяем фильтр по активности, если isActive определен
      if (isActive !== undefined) {
        queryBuilder.andWhere('employee.is_active = :is_active', {
          is_active: isActive,
        });
      }

      const employees = await queryBuilder.getMany();

      return employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        is_active: employee.is_active,
      }));
    } catch (error) {
      console.error('Error in findByRoles service method:', error); // Логируем ошибку в сервисе
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотрудниках.',
        error.message,
      );
    }
  }
}
