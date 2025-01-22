import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialConsumption } from './material-consumption.entity';
import { BackpackEmployee } from '../backpack-employee/backpack-employee.entity';
import { RequestData } from '../request-data/request-data.entity';
import { MaterialConsumptionResponseDto } from './material-consumption.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { Employee } from '../employee/employee.entity';
import { JwtService } from '@nestjs/jwt';
import { AuditLogService } from '../audit-log/audit-log.service';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';

@Injectable()
export class MaterialConsumptionService {
  constructor(
    @InjectRepository(MaterialConsumption)
    private readonly materialConsumptionRepository: Repository<MaterialConsumption>,
    @InjectRepository(BackpackEmployee)
    private readonly backpackEmployeeRepository: Repository<BackpackEmployee>,
    @InjectRepository(RequestData)
    private readonly requestDataRepository: Repository<RequestData>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(WarehouseFilling)
    private readonly warehouseFillingRepository: Repository<WarehouseFilling>,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async useMaterialOnRequest(
    token: string,
    requestId: number,
    backpackEmployeeId: number,
    count: number,
  ): Promise<{ message: string }> {
    if (count <= 0) {
      throw new Error('Количество материала должно быть положительным числом');
    }

    const employeeId = this.extractUserIdFromToken(token);

    const requestData = await this.requestDataRepository.findOne({
      where: {
        request: { id: requestId },
        performer_id: { id: employeeId },
      },
      relations: ['request'],
    });

    if (!requestData) {
      throw new Error('Сотрудник не назначен на эту заявку');
    }

    const backpackEmployee = await this.backpackEmployeeRepository.findOne({
      where: {
        id: backpackEmployeeId,
        employee_id: { id: employeeId },
      },
      relations: [
        'employee_id',
        'warehouse_filling_id',
        'warehouse_filling_id.material',
      ],
    });

    if (!backpackEmployee) {
      throw new Error('Сотрудник не имеет доступа к этому рюкзаку');
    }

    if (backpackEmployee.count < count) {
      throw new Error('Недостаточно материала в рюкзаке');
    }

    // Создаем и сохраняем расход материала
    const materialConsumption = this.materialConsumptionRepository.create({
      requestData,
      backpackEmployee,
      count,
      approved: false,
    });

    await this.materialConsumptionRepository.save(materialConsumption);

    // Обновляем количество материала в рюкзаке
    backpackEmployee.count -= count;
    await this.backpackEmployeeRepository.save(backpackEmployee);

    //console.log(materialConsumption.backpackEmployee);
    // Логируем действие
    await this.auditLogService.logAction({
      employee_id: employeeId,
      action: 'UseMaterial',
      table_name: 'material_consumption',
      record_id: materialConsumption.id,
      details: {
        count: count,
        sap: materialConsumption.backpackEmployee.warehouse_filling_id.material
          .sap_number,
        serial:
          materialConsumption.backpackEmployee.warehouse_filling_id.material
            .serial,
        subtype:
          materialConsumption.backpackEmployee.warehouse_filling_id.material
            .subtype_id.name,
        address: materialConsumption.requestData.request.address,
        client_id: materialConsumption.requestData.request.client_id,
      },
    });

    // Возвращаем информацию о подтверждении использования материала
    return {
      message: 'Material successfully used',
    };
  }

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

  async getAllMaterialConsumptions(): Promise<
    MaterialConsumptionResponseDto[]
  > {
    try {
      const materialConsumptions =
        await this.materialConsumptionRepository.find({
          relations: [
            'backpackEmployee.employee_id',
            'backpackEmployee.warehouse_filling_id',
            'backpackEmployee.warehouse_filling_id.material',
            'backpackEmployee.warehouse_filling_id.material.category_id',
            'backpackEmployee.warehouse_filling_id.material.type_id',
            'backpackEmployee.warehouse_filling_id.material.subtype_id',
            'requestData.request',
          ],
        });
      return materialConsumptions.map(
        (materialConsumption) =>
          new MaterialConsumptionResponseDto(materialConsumption),
      );
    } catch (error) {
      console.error('Error retrieving material consumptions:', error);
      throw new DetailedInternalServerErrorException(
        'Error retrieving material consumptions',
        error.message,
      );
    }
  }

  async getMaterialConsumptionsByApproval(
    approved: boolean,
  ): Promise<MaterialConsumptionResponseDto[]> {
    try {
      const materialConsumptions =
        await this.materialConsumptionRepository.find({
          where: { approved },
          relations: [
            'backpackEmployee.employee_id',
            'backpackEmployee.warehouse_filling_id',
            'backpackEmployee.warehouse_filling_id.material',
            'backpackEmployee.warehouse_filling_id.material.category_id',
            'backpackEmployee.warehouse_filling_id.material.type_id',
            'backpackEmployee.warehouse_filling_id.material.subtype_id',
            'requestData.request',
          ],
        });

      return materialConsumptions.map(
        (materialConsumption) =>
          new MaterialConsumptionResponseDto(materialConsumption),
      );
    } catch (error) {
      console.error(
        'Error retrieving material consumptions by approval:',
        error,
      );
      throw new DetailedInternalServerErrorException(
        'Error retrieving material consumptions by approval',
        error.message,
      );
    }
  }

  async approveMaterialConsumption(
    id: number,
    token: string,
  ): Promise<MaterialConsumption> {
    try {
      // Проверяем существование записи
      const materialConsumption =
        await this.materialConsumptionRepository.findOne({
          where: { id },
          relations: [
            'backpackEmployee.employee_id',
            'backpackEmployee.warehouse_filling_id',
            'backpackEmployee.warehouse_filling_id.material',
            'backpackEmployee.warehouse_filling_id.material.category_id',
            'backpackEmployee.warehouse_filling_id.material.type_id',
            'backpackEmployee.warehouse_filling_id.material.subtype_id',
            'requestData.request',
          ],
        });

      if (!materialConsumption) {
        throw new NotFoundException('Material consumption not found');
      }

      // Проверяем, одобрено ли уже потребление материала
      if (materialConsumption.approved) {
        throw new HttpException(
          'Material consumption is already approved',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Обновляем запись
      materialConsumption.approved = true;
      const updatedMaterialConsumption =
        await this.materialConsumptionRepository.save(materialConsumption);

      // Извлекаем ID кладовщика из токена
      const storekeeperId = this.extractUserIdFromToken(token);
      const storekeeper = await this.employeeRepository.findOne({
        where: { id: storekeeperId },
      });

      if (!storekeeper) {
        throw new NotFoundException('Storekeeper not found');
      }

      const storekeeperName = storekeeper.name;

      // Логируем действие
      await this.auditLogService.logAction({
        employee_id: storekeeperId,
        action: 'ApproveMaterialConsumption',
        table_name: 'material_consumption',
        record_id: updatedMaterialConsumption.id,
        details: {
          count: updatedMaterialConsumption.count,
          material:
            updatedMaterialConsumption.backpackEmployee.warehouse_filling_id
              .material.subtype_id.name,
          sap: updatedMaterialConsumption.backpackEmployee.warehouse_filling_id
            .material.sap_number,
          serial:
            updatedMaterialConsumption.backpackEmployee.warehouse_filling_id
              .material.serial,
          inventory_number:
            updatedMaterialConsumption.backpackEmployee.warehouse_filling_id
              .material.inventory_number,
          storekeeper: storekeeperName,
          client: materialConsumption.requestData.request.client_id,
          backpack_owner:
            updatedMaterialConsumption.backpackEmployee.employee_id.name,
          address: updatedMaterialConsumption.requestData.request.address,
        },
      });

      return updatedMaterialConsumption;
    } catch (error) {
      console.error('Error in approveMaterialConsumption:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new DetailedInternalServerErrorException(
          'Error approving material consumption',
          error.message || 'Internal server error',
        );
      }
    }
  }
}
