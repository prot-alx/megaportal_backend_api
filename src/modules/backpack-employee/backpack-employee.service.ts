import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackpackEmployee } from './backpack-employee.entity';
import {
  CreateBackpackEmployeeDto,
  UpdateBackpackEmployeeDto,
} from './backpack-employee.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class BackpackEmployeeService {
  constructor(
    @InjectRepository(BackpackEmployee)
    private readonly backpackEmployeeRepository: Repository<BackpackEmployee>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createBackpackEmployeeDto: CreateBackpackEmployeeDto,
    employeeId: number,
  ): Promise<BackpackEmployee> {
    const backpackEmployee = this.backpackEmployeeRepository.create(
      createBackpackEmployeeDto,
    );
    await this.backpackEmployeeRepository.save(backpackEmployee);

    // Логирование действия
    await this.auditLogService.logAction({
      employee_id: employeeId,
      action: 'Create',
      table_name: 'backpack_employee',
      record_id: backpackEmployee.id,
      details: createBackpackEmployeeDto,
    });

    return backpackEmployee;
  }

  async update(
    id: number,
    updateBackpackEmployeeDto: UpdateBackpackEmployeeDto,
    employeeId: number,
  ): Promise<BackpackEmployee> {
    const backpackEmployee = await this.backpackEmployeeRepository.findOneBy({
      id,
    });
    if (!backpackEmployee) {
      throw new NotFoundException(`BackpackEmployee with ID ${id} not found`);
    }

    this.backpackEmployeeRepository.merge(
      backpackEmployee,
      updateBackpackEmployeeDto,
    );
    await this.backpackEmployeeRepository.save(backpackEmployee);

    // Логирование действия
    await this.auditLogService.logAction({
      employee_id: employeeId,
      action: 'Update',
      table_name: 'backpack_employee',
      record_id: backpackEmployee.id,
      details: updateBackpackEmployeeDto,
    });

    return backpackEmployee;
  }

  // Метод для получения всех записей backpack_employee
  async findAll(): Promise<BackpackEmployee[]> {
    return this.backpackEmployeeRepository.find();
  }

  // Метод для получения всех записей для конкретного сотрудника
  async findByEmployeeId(employeeId: number): Promise<BackpackEmployee[]> {
    const records = await this.backpackEmployeeRepository.find({
      where: { employee: { id: employeeId } },
    });

    if (!records.length) {
      throw new NotFoundException(
        `No records found for employee with ID ${employeeId}`,
      );
    }

    return records;
  }
}
