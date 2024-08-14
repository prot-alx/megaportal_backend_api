import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';
import { MaterialConsumption } from './material-consumption.entity';

export class CreateMaterialConsumptionDto {
  @ApiProperty({
    description: 'ID данных заявки',
    example: 1,
  })
  @IsInt()
  requestDataId: number;

  @ApiProperty({
    description: 'ID сотрудника в рюкзаке',
    example: 1,
  })
  @IsInt()
  backpackEmployeeId: number;

  @ApiProperty({
    description: 'Количество материала',
    example: 10,
  })
  @IsInt()
  count: number;

  @ApiProperty({
    description: 'Статус одобрения материала',
    example: false,
  })
  @IsBoolean()
  approved: boolean;
}

export class UpdateMaterialConsumptionDto {
  @ApiProperty({
    description: 'Статус одобрения материала',
    example: true,
  })
  @IsBoolean()
  approved: boolean;
}

export class MaterialConsumptionDto {
  @ApiProperty({
    description: 'ID расхода материала',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID данных заявки',
    example: 1,
  })
  request_data_id: number;

  @ApiProperty({
    description: 'ID сотрудника в рюкзаке',
    example: 1,
  })
  backpack_employee_id: number;

  @ApiProperty({
    description: 'Количество материала',
    example: 10,
  })
  count: number;
}

export class MaterialConsumptionResponseDto {
  @ApiProperty({
    description: 'ID расхода материала',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Количество материала',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'Статус одобрения материала',
    example: false,
  })
  approved: boolean;

  @ApiProperty({
    description: 'Дата использования материала',
    example: '2024-08-14T13:50:21.639Z',
  })
  used_at: Date;

  @ApiProperty({
    description: 'Имя сотрудника, который использовал материал',
    example: 'John Doe',
  })
  used_by: string;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP12345',
  })
  sap: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV12345',
  })
  inventory_number: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SER12345',
  })
  serial: string;

  @ApiProperty({
    description: 'Категория материала',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'Тип материала',
    example: 'Component',
  })
  type: string;

  @ApiProperty({
    description: 'Подтип материала',
    example: 'Resistor',
  })
  subtype: string;

  @ApiProperty({
    description: 'ID клиента, связанного с заявкой',
    example: 'CLIENT123',
  })
  client_id: string;

  @ApiProperty({
    description: 'Адрес клиента, связанного с заявкой',
    example: '123 Main St, Anytown, USA',
  })
  address: string;

  constructor(materialConsumption: MaterialConsumption) {
    this.id = materialConsumption.id;
    this.count = materialConsumption.count;
    this.approved = materialConsumption.approved;
    this.used_at = materialConsumption.created_at;
    this.used_by = materialConsumption.backpackEmployee.employee_id.name;
    this.sap =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.sap_number;
    this.inventory_number =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.inventory_number;
    this.serial =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.serial;
    this.category =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.category_id.name;
    this.type =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.type_id.name;
    this.subtype =
      materialConsumption.backpackEmployee.warehouse_filling_id.material.subtype_id.name;
    this.client_id = materialConsumption.requestData.request.client_id;
    this.address = materialConsumption.requestData.request.address;
  }
}
