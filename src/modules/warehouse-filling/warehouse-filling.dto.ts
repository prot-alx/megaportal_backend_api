import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString } from 'class-validator';
import { WarehouseFilling } from './warehouse-filling.entity';

export class CreateWarehouseFillingDto {
  @ApiProperty({
    description: 'ID материала',
    example: 1,
  })
  @IsInt({ message: 'material_id must be an integer' })
  material_id: number;

  @ApiProperty({
    description: 'Количество материала на складе',
    example: 100,
  })
  @IsInt({ message: 'count must be an integer' })
  @IsPositive({ message: 'count must be a positive number' })
  count: number;
}

export class AddOrRemoveQuantityDto {
  @ApiProperty({
    description:
      'Количество для добавления или удаления. Положительное значение добавляет, отрицательное удаляет',
    example: 20,
  })
  @IsInt({ message: 'count must be an integer' })
  @IsOptional()
  @IsPositive({ message: 'count must be a positive number if provided' })
  count?: number;
}

export class MaterialQuantityDetailsDto {
  @ApiProperty({
    description: 'Категория материала',
    example: 'Металлы',
  })
  @IsString()
  material_category: string;

  @ApiProperty({
    description: 'Тип материала',
    example: 'Сталь',
  })
  @IsString()
  material_type: string;

  @ApiProperty({
    description: 'Подтип материала',
    example: 'Нержавеющая сталь',
  })
  @IsString()
  material_subtype: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SN123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP987654',
    required: false,
  })
  @IsOptional()
  @IsString()
  sap_number?: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  inventory_number?: string;

  @ApiProperty({
    description: 'Количество материала',
    example: 50,
  })
  @IsInt({ message: 'count must be an integer' })
  count: number;
}

export class WarehouseMaterialDto {
  @ApiProperty({
    description: 'ID записи на складе',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Количество материала на складе',
    example: 100,
  })
  count: number;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP987654',
  })
  sap_number: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SN123456',
  })
  serial: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV654321',
  })
  inventory_number: string;

  @ApiProperty({
    description: 'Название категории материала',
    example: 'Металлы',
  })
  category_name: string;

  @ApiProperty({
    description: 'Название типа материала',
    example: 'Сталь',
  })
  type_name: string;

  @ApiProperty({
    description: 'Название подтипа материала',
    example: 'Нержавеющая сталь',
  })
  subtype_name: string;

  constructor(warehouseMaterial: WarehouseFilling) {
    this.id = warehouseMaterial.id;
    this.count = warehouseMaterial.count;
    this.sap_number = warehouseMaterial.material.sap_number;
    this.serial = warehouseMaterial.material.serial;
    this.inventory_number = warehouseMaterial.material.inventory_number;
    this.category_name = warehouseMaterial.material.category_id.name;
    this.type_name = warehouseMaterial.material.type_id.name;
    this.subtype_name = warehouseMaterial.material.subtype_id.name;
  }
}
