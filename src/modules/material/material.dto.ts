import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsInt } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'category_id is required' })
  @IsInt({ message: 'category_id must be an integer' })
  category_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'type_id is required' })
  @IsInt({ message: 'type_id must be an integer' })
  type_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'subtype_id is required' })
  @IsInt({ message: 'subtype_id must be an integer' })
  subtype_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sap_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  inventory_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateMaterialDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  type_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  subtype_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sap_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  inventory_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
