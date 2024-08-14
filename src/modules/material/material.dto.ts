import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Material } from './material.entity';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'ID категории материала',
    example: 1,
  })
  @IsNotEmpty({ message: 'category_id is required' })
  @IsInt({ message: 'category_id must be an integer' })
  category_id: number;

  @ApiProperty({
    description: 'ID типа материала',
    example: 2,
  })
  @IsNotEmpty({ message: 'type_id is required' })
  @IsInt({ message: 'type_id must be an integer' })
  type_id: number;

  @ApiProperty({
    description: 'ID подтипа материала',
    example: 3,
  })
  @IsNotEmpty({ message: 'subtype_id is required' })
  @IsInt({ message: 'subtype_id must be an integer' })
  subtype_id: number;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  sap_number?: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SN123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  inventory_number?: string;

  @ApiProperty({
    description: 'Флаг активности материала',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateMaterialDto {
  @ApiProperty({
    description: 'ID категории материала',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty({
    description: 'ID типа материала',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  type_id?: number;

  @ApiProperty({
    description: 'ID подтипа материала',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  subtype_id?: number;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  sap_number?: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SN123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  inventory_number?: string;

  @ApiProperty({
    description: 'Флаг активности материала',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class MaterialDto {
  @ApiProperty({
    description: 'ID материала',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'SAP номер материала',
    example: 'SAP123456',
  })
  sap_number: string;

  @ApiProperty({
    description: 'Серийный номер материала',
    example: 'SN123456',
  })
  serial: string;

  @ApiProperty({
    description: 'Инвентарный номер материала',
    example: 'INV123456',
  })
  inventory_number: string;

  @ApiProperty({
    description: 'Флаг активности материала',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Название категории материала',
    example: 'Расходники',
  })
  category_name: string;

  @ApiProperty({
    description: 'Название типа материала',
    example: 'Кабель',
  })
  type_name: string;

  @ApiProperty({
    description: 'Название подтипа материала',
    example: 'Utp cat5e 4x2',
  })
  subtype_name: string;

  constructor(material: Material) {
    this.id = material.id;
    this.sap_number = material.sap_number;
    this.serial = material.serial;
    this.inventory_number = material.inventory_number;
    this.is_active = material.is_active;
    this.category_name = material.category_id.name;
    this.type_name = material.type_id.name;
    this.subtype_name = material.subtype_id.name;
  }
}
