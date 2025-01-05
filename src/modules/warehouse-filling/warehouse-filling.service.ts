import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseFilling } from './warehouse-filling.entity';
import { Material } from '../material/material.entity';
import {
  CreateWarehouseFillingDto,
  WarehouseMaterialDto,
} from './warehouse-filling.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { JwtService } from '@nestjs/jwt';
import { Employee } from '../employee/employee.entity';

@Injectable()
export class WarehouseFillingService {
  constructor(
    @InjectRepository(WarehouseFilling)
    private readonly warehouseFillingRepository: Repository<WarehouseFilling>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
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

  async create(
    createWarehouseFillingDto: CreateWarehouseFillingDto,
    token: string,
  ): Promise<WarehouseFilling> {
    const { material_id, count } = createWarehouseFillingDto;

    // Check if the count is non-negative
    if (count < 0) {
      throw new BadRequestException('Count must be a non-negative number');
    }

    // Fetch the material details
    const material = await this.materialRepository.findOne({
      where: { id: material_id },
      relations: ['category_id', 'type_id', 'subtype_id'],
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${material_id} not found`);
    }

    // Get the employee details
    const userId = this.extractUserIdFromToken(token);
    const storekeeper = await this.getEmployeeName(userId);

    const details: any = {
      count,
      storekeeper,
      material: material.subtype_id?.name || '',
      sn: material.serial || '',
      sap: material.sap_number || '',
      inventory_number: material.inventory_number || '',
    };

    if (material.serial || material.inventory_number) {
      const existingWarehouseFilling =
        await this.warehouseFillingRepository.findOne({
          where: { material: { id: material_id } },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });

      if (existingWarehouseFilling) {
        // Check if the existing material quantity is greater than 0
        if (existingWarehouseFilling.count > 0) {
          throw new BadRequestException(
            'Material with the same serial or inventory number already exists',
          );
        }

        // If the material exists but its count is 0, update it
        existingWarehouseFilling.count = count;
        const updatedWarehouseFilling =
          await this.warehouseFillingRepository.save(existingWarehouseFilling);

        // Log the action
        await this.auditLogService.logAction({
          employee_id: userId,
          action: 'Add',
          table_name: 'warehouse_filling',
          record_id: updatedWarehouseFilling.id,
          details,
        });

        // Return the updated record with all material details
        return this.warehouseFillingRepository.findOne({
          where: { id: updatedWarehouseFilling.id },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });
      } else {
        // If the material does not exist in the warehouse, create a new record
        const newWarehouseFilling = this.warehouseFillingRepository.create({
          material,
          count,
        });

        const createdWarehouseFilling =
          await this.warehouseFillingRepository.save(newWarehouseFilling);

        // Log the action
        await this.auditLogService.logAction({
          employee_id: userId,
          action: 'Add',
          table_name: 'warehouse_filling',
          record_id: createdWarehouseFilling.id,
          details,
        });

        // Return the created record with all material details
        return this.warehouseFillingRepository.findOne({
          where: { id: createdWarehouseFilling.id },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });
      }
    } else {
      // For materials without serial or inventory number, handle them normally
      const existingWarehouseFilling =
        await this.warehouseFillingRepository.findOne({
          where: { material: { id: material_id } },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });

      if (existingWarehouseFilling) {
        // If the material exists, update the quantity
        existingWarehouseFilling.count += count;
        const updatedWarehouseFilling =
          await this.warehouseFillingRepository.save(existingWarehouseFilling);

        // Log the action
        await this.auditLogService.logAction({
          employee_id: userId,
          action: 'Add',
          table_name: 'warehouse_filling',
          record_id: updatedWarehouseFilling.id,
          details,
        });

        // Return the updated record with all material details
        return this.warehouseFillingRepository.findOne({
          where: { id: updatedWarehouseFilling.id },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });
      } else {
        // If the material does not exist, create a new record
        const newWarehouseFilling = this.warehouseFillingRepository.create({
          material,
          count,
        });

        const createdWarehouseFilling =
          await this.warehouseFillingRepository.save(newWarehouseFilling);

        // Log the action
        await this.auditLogService.logAction({
          employee_id: userId,
          action: 'Add',
          table_name: 'warehouse_filling',
          record_id: createdWarehouseFilling.id,
          details,
        });

        // Return the created record with all material details
        return this.warehouseFillingRepository.findOne({
          where: { id: createdWarehouseFilling.id },
          relations: [
            'material',
            'material.category_id',
            'material.type_id',
            'material.subtype_id',
          ],
        });
      }
    }
  }

  async addQuantity(
    id: number,
    count: number,
    token: string,
  ): Promise<WarehouseFilling> {
    // Check if the count is non-negative
    if (count < 0) {
      throw new BadRequestException('Count must be a non-negative number');
    }

    try {
      const warehouseFilling = await this.warehouseFillingRepository.findOne({
        where: { id },
        relations: [
          'material',
          'material.category_id',
          'material.type_id',
          'material.subtype_id',
        ],
      });

      if (!warehouseFilling) {
        throw new NotFoundException(`WarehouseFilling with ID ${id} not found`);
      }

      const material = warehouseFilling.material;

      // Check if the material has a serial or inventory number
      if (material.serial || material.inventory_number) {
        // Ensure that the total quantity does not exceed 1
        if (warehouseFilling.count + count > 1) {
          throw new BadRequestException(
            'Quantity for materials with a serial or inventory number cannot exceed 1',
          );
        }
      }

      warehouseFilling.count += count;
      const updatedWarehouseFilling =
        await this.warehouseFillingRepository.save(warehouseFilling);

      // Get the employee details
      const userId = this.extractUserIdFromToken(token);
      const storekeeper = await this.getEmployeeName(userId);

      // Prepare the details object
      const details: any = {
        count,
        storekeeper,
        material: material.subtype_id?.name || '',
        sn: material.serial || '',
        sap: material.sap_number || '',
        inventory_number: material.inventory_number || '',
      };

      // Log the action
      await this.auditLogService.logAction({
        employee_id: userId,
        action: 'Add',
        table_name: 'warehouse_filling',
        record_id: updatedWarehouseFilling.id,
        details,
      });

      // Return the updated record with all material details
      return this.warehouseFillingRepository.findOne({
        where: { id: updatedWarehouseFilling.id },
        relations: [
          'material',
          'material.category_id',
          'material.type_id',
          'material.subtype_id',
        ],
      });
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error adding quantity to warehouse filling record',
        error.message,
      );
    }
  }

  async removeQuantity(
    id: number,
    count: number,
    token: string,
  ): Promise<WarehouseFilling> {
    try {
      const warehouseFilling = await this.warehouseFillingRepository.findOne({
        where: { id },
        relations: [
          'material',
          'material.category_id',
          'material.type_id',
          'material.subtype_id',
        ],
      });

      if (!warehouseFilling) {
        throw new NotFoundException(`WarehouseFilling with ID ${id} not found`);
      }

      const material = warehouseFilling.material;

      // Check if the material has a serial or inventory number
      if (material.serial || material.inventory_number) {
        if (count > warehouseFilling.count) {
          throw new BadRequestException('Insufficient quantity to remove');
        }

        // Ensure that the quantity does not go below 0
        if (warehouseFilling.count - count < 0) {
          throw new BadRequestException('Insufficient quantity to remove');
        }
      }

      warehouseFilling.count -= count;
      const updatedWarehouseFilling =
        await this.warehouseFillingRepository.save(warehouseFilling);

      // Get the employee details
      const userId = this.extractUserIdFromToken(token);
      const storekeeper = await this.getEmployeeName(userId);

      // Prepare the details object
      const details: any = {
        count,
        storekeeper,
        material: material.subtype_id?.name || '',
        sn: material.serial || '',
        sap: material.sap_number || '',
        inventory_number: material.inventory_number || '',
      };

      // Log the action
      await this.auditLogService.logAction({
        employee_id: userId,
        action: 'Remove',
        table_name: 'warehouse_filling',
        record_id: updatedWarehouseFilling.id,
        details,
      });

      // Return the updated record with all material details
      return this.warehouseFillingRepository.findOne({
        where: { id: updatedWarehouseFilling.id },
        relations: [
          'material',
          'material.category_id',
          'material.type_id',
          'material.subtype_id',
        ],
      });
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing quantity from warehouse filling record',
        error.message,
      );
    }
  }

  async getWarehouseMaterialById(id: number): Promise<WarehouseMaterialDto> {
    const material = await this.warehouseFillingRepository.findOne({
      where: { id },
      relations: [
        'material',
        'material.category_id',
        'material.type_id',
        'material.subtype_id',
      ],
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return new WarehouseMaterialDto(material);
  }

  async getAllWarehouseMaterials(): Promise<WarehouseMaterialDto[]> {
    const materials = await this.warehouseFillingRepository.find({
      relations: [
        'material',
        'material.category_id',
        'material.type_id',
        'material.subtype_id',
      ],
    });

    return materials.map((material) => new WarehouseMaterialDto(material));
  }
}
