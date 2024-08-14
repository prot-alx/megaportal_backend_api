import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { BackpackEmployee } from './backpack-employee.entity';

export class CreateBackpackEmployeeDto {
  @ApiProperty()
  @IsInt()
  employee_id: number;

  @ApiProperty()
  @IsInt()
  warehouse_filling_id: number;

  @ApiProperty()
  @IsInt()
  count: number;
}

export class UpdateBackpackEmployeeDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  employee_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  warehouse_filling_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  count?: number;
}

export class TransferMaterialDto {
  warehouse_filling_id: number; // ID записи на складе
  employee_id: number; // ID сотрудника, которому передается материал
  count: number; // Количество передаваемого материала
}

export class BackpackEmployeeDto {
  id: number;
  count: number;
  issued_at: Date;
  sap_number: string;
  serial: string;
  inventory_number: string;
  category_name: string;
  type_name: string;
  subtype_name: string;
  employee_name: string;

  constructor(backpackEmployee: BackpackEmployee) {
    this.id = backpackEmployee.id;
    this.count = backpackEmployee.count;
    this.issued_at = backpackEmployee.created_at;
    this.sap_number = backpackEmployee.warehouse_filling_id.material.sap_number;
    this.serial = backpackEmployee.warehouse_filling_id.material.serial;
    this.inventory_number =
      backpackEmployee.warehouse_filling_id.material.inventory_number;
    this.category_name =
      backpackEmployee.warehouse_filling_id.material.category_id.name;
    this.type_name = backpackEmployee.warehouse_filling_id.material.type_id.name;
    this.subtype_name =
      backpackEmployee.warehouse_filling_id.material.subtype_id.name;
    this.employee_name = backpackEmployee.employee_id
      ? backpackEmployee.employee_id.name
      : '';
  }
}

export class MyBackpackDto {
  count: number;
  issued_at: Date;
  sap_number: string;
  serial: string;
  inventory_number: string;
  category_name: string;
  type_name: string;
  subtype_name: string;

  constructor(backpackEmployee: BackpackEmployee) {
    this.count = backpackEmployee.count;
    this.issued_at = backpackEmployee.created_at;
    this.sap_number = backpackEmployee.warehouse_filling_id.material.sap_number;
    this.serial = backpackEmployee.warehouse_filling_id.material.serial;
    this.inventory_number =
      backpackEmployee.warehouse_filling_id.material.inventory_number;
    this.category_name =
      backpackEmployee.warehouse_filling_id.material.category_id.name;
    this.type_name = backpackEmployee.warehouse_filling_id.material.type_id.name;
    this.subtype_name =
      backpackEmployee.warehouse_filling_id.material.subtype_id.name;
  }
}
