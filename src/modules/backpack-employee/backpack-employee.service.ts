import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Employee } from '../employee/employee.entity';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';
import { BackpackEmployee } from './backpack-employee.entity';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { BackpackEmployeeDto, MyBackpackDto } from './backpack-employee.dto';

@Injectable()
export class BackpackEmployeeService {
  constructor(
    @InjectRepository(BackpackEmployee)
    private readonly backpackEmployeeRepository: Repository<BackpackEmployee>,
    @InjectRepository(WarehouseFilling)
    private readonly warehouseFillingRepository: Repository<WarehouseFilling>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly auditLogService: AuditLogService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserIdFromToken(token: string): number {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken?.id) {
        throw new UnauthorizedException('Invalid or missing token');
      }
      return decodedToken.id;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error extracting user ID from token',
        error.message,
      );
    }
  }

  private async getEmployeeName(employeeId: number): Promise<string> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new UnauthorizedException('Сотрудник не найден.');
    }
    return employee.name;
  }

  // Выдаем материал специалисту
  async transferMaterial(
    warehouseFillingId: number,
    employeeId: number,
    count: number,
    token: string,
  ): Promise<BackpackEmployee> {
    const warehouseFilling = await this.warehouseFillingRepository.findOne({
      where: { id: warehouseFillingId },
    });

    if (!warehouseFilling || warehouseFilling.count < count) {
      throw new NotFoundException('Недостаточно материала на складе');
    }

    let backpackEmployee = await this.backpackEmployeeRepository.findOne({
      where: {
        employee_id: { id: employeeId },
        warehouse_filling_id: { id: warehouseFillingId },
      },
    });

    if (backpackEmployee) {
      backpackEmployee.count += count;
    } else {
      backpackEmployee = this.backpackEmployeeRepository.create({
        employee_id: { id: employeeId },
        warehouse_filling_id: warehouseFilling,
        count,
      });
    }

    warehouseFilling.count -= count;
    await this.warehouseFillingRepository.save(warehouseFilling);
    await this.backpackEmployeeRepository.save(backpackEmployee);

    const storekeeperId = this.extractUserIdFromToken(token);
    const storekeeperName = await this.getEmployeeName(storekeeperId);
    const ownerName = await this.getEmployeeName(employeeId);

    await this.auditLogService.logAction({
      employee_id: storekeeperId,
      action: 'Transfer',
      table_name: 'backpack_employee',
      record_id: backpackEmployee.id,
      details: {
        count: count,
        material: warehouseFilling.material.subtype_id.name,
        sap: warehouseFilling.material.sap_number,
        serial: warehouseFilling.material.serial,
        inventory_number: warehouseFilling.material.inventory_number,
        storekeeper: storekeeperName,
        owner: ownerName,
      },
    });

    return backpackEmployee;
  }

  // Возврат материала на склад от специалиста
  async returnMaterial(
    backpackEmployeeId: number,
    count: number,
    token: string,
  ): Promise<BackpackEmployee> {
    const backpackEmployee = await this.backpackEmployeeRepository.findOne({
      where: { id: backpackEmployeeId },
      relations: ['warehouse_filling_id'],
    });

    if (!backpackEmployee || backpackEmployee.count < count) {
      throw new NotFoundException(
        'Недостаточно материала в рюкзаке сотрудника',
      );
    }

    backpackEmployee.count -= count;
    await this.backpackEmployeeRepository.save(backpackEmployee);

    const warehouseFilling = backpackEmployee.warehouse_filling_id;
    warehouseFilling.count += count;
    await this.warehouseFillingRepository.save(warehouseFilling);

    const storekeeperId = this.extractUserIdFromToken(token);
    const storekeeperName = await this.getEmployeeName(storekeeperId);
    const ownerName = await this.getEmployeeName(
      backpackEmployee.employee_id.id,
    );

    await this.auditLogService.logAction({
      employee_id: storekeeperId,
      action: 'Return',
      table_name: 'warehouse_filling',
      record_id: warehouseFilling.id,
      details: {
        count: count,
        material: warehouseFilling.material.subtype_id.name,
        sap: warehouseFilling.material.sap_number,
        sn: warehouseFilling.material.serial,
        inventory_number: warehouseFilling.material.inventory_number,
        storekeeper: storekeeperName,
        owner: ownerName,
      },
    });

    return backpackEmployee;
  }

  async getAllMaterials(): Promise<BackpackEmployeeDto[]> {
    const materials = await this.backpackEmployeeRepository.find({
      relations: [
        'warehouse_filling_id',
        'warehouse_filling_id.material',
        'warehouse_filling_id.material.category_id',
        'warehouse_filling_id.material.type_id',
        'warehouse_filling_id.material.subtype_id',
        'employee_id',
      ],
    });

    return materials.map((material) => new BackpackEmployeeDto(material));
  }

  async getEmployeeMaterials(token: string): Promise<MyBackpackDto[]> {
    const decodedToken = this.jwtService.decode(token);
    const employeeId = decodedToken.sub;

    const materials = await this.backpackEmployeeRepository.find({
      where: { employee_id: { id: employeeId } },
      relations: [
        'warehouse_filling_id',
        'warehouse_filling_id.material',
        'warehouse_filling_id.material.category_id',
        'warehouse_filling_id.material.type_id',
        'warehouse_filling_id.material.subtype_id',
        'employee_id',
      ],
    });

    return materials.map((material) => new MyBackpackDto(material));
  }
}
