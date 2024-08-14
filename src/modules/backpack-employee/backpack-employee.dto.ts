import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { BackpackEmployee } from './backpack-employee.entity';

export class CreateBackpackEmployeeDto {
  @ApiProperty({
    description: 'ID сотрудника, который получает материал.',
    example: 1,
  })
  @IsInt()
  employee_id: number;

  @ApiProperty({
    description: 'ID записи на складе, из которой передается материал.',
    example: 1,
  })
  @IsInt()
  warehouse_filling_id: number;

  @ApiProperty({
    description: 'Количество передаваемого материала.',
    example: 10,
  })
  @IsInt()
  count: number;
}

export class UpdateBackpackEmployeeDto {
  @ApiProperty({
    description: 'ID сотрудника, который получает материал.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  employee_id?: number;

  @ApiProperty({
    description: 'ID записи на складе, из которой передается материал.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  warehouse_filling_id?: number;

  @ApiProperty({
    description: 'Количество передаваемого материала.',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  count?: number;
}

export class TransferMaterialDto {
  @ApiProperty({
    description: 'ID записи на складе, из которой передается материал.',
    example: 1,
  })
  warehouse_filling_id: number;

  @ApiProperty({
    description: 'ID сотрудника, которому передается материал.',
    example: 1,
  })
  employee_id: number;

  @ApiProperty({
    description: 'Количество передаваемого материала.',
    example: 10,
  })
  count: number;
}

export class BackpackEmployeeDto {
  @ApiProperty({
    description: 'ID записи.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Количество материала.',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'Дата выдачи материала.',
    example: '2024-08-14T00:00:00Z',
  })
  issued_at: Date;

  @ApiProperty({
    description: 'SAP номер материала.',
    example: 'SAP123456',
  })
  sap_number: string;

  @ApiProperty({
    description: 'Серийный номер материала.',
    example: 'SN123456',
  })
  serial: string;

  @ApiProperty({
    description: 'Инвентарный номер материала.',
    example: 'INV123456',
  })
  inventory_number: string;

  @ApiProperty({
    description: 'Название категории материала.',
    example: 'Electronics',
  })
  category_name: string;

  @ApiProperty({
    description: 'Название типа материала.',
    example: 'Resistor',
  })
  type_name: string;

  @ApiProperty({
    description: 'Название подтипа материала.',
    example: 'Surface Mount',
  })
  subtype_name: string;

  @ApiProperty({
    description: 'Имя сотрудника, получившего материал.',
    example: 'John Doe',
  })
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
    this.type_name =
      backpackEmployee.warehouse_filling_id.material.type_id.name;
    this.subtype_name =
      backpackEmployee.warehouse_filling_id.material.subtype_id.name;
    this.employee_name = backpackEmployee.employee_id
      ? backpackEmployee.employee_id.name
      : '';
  }
}

export class MyBackpackDto {
  @ApiProperty({
    description: 'Количество материала.',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'Дата выдачи материала.',
    example: '2024-08-14T00:00:00Z',
  })
  issued_at: Date;

  @ApiProperty({
    description: 'SAP номер материала.',
    example: 'SAP123456',
  })
  sap_number: string;

  @ApiProperty({
    description: 'Серийный номер материала.',
    example: 'SN123456',
  })
  serial: string;

  @ApiProperty({
    description: 'Инвентарный номер материала.',
    example: 'INV123456',
  })
  inventory_number: string;

  @ApiProperty({
    description: 'Название категории материала.',
    example: 'Electronics',
  })
  category_name: string;

  @ApiProperty({
    description: 'Название типа материала.',
    example: 'Resistor',
  })
  type_name: string;

  @ApiProperty({
    description: 'Название подтипа материала.',
    example: 'Surface Mount',
  })
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
    this.type_name =
      backpackEmployee.warehouse_filling_id.material.type_id.name;
    this.subtype_name =
      backpackEmployee.warehouse_filling_id.material.subtype_id.name;
  }
}
