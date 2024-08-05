import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { MaterialCategory } from '../material-category/material-category.entity';
import { MaterialType } from '../material-type/material-type.entity';
import { MaterialSubtype } from '../material-subtype/material-subtype.entity';

export class CreateMaterialDto {
  @IsOptional()
  @IsString()
  sapNumber?: string;

  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  @IsString()
  inventoryNumber?: string;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  category?: MaterialCategory;

  @IsOptional()
  type?: MaterialType;

  @IsOptional()
  subtype?: MaterialSubtype;
}

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  sapNumber?: string;

  @IsOptional()
  @IsString()
  serial?: string;

  @IsOptional()
  @IsString()
  inventoryNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  category?: MaterialCategory;

  @IsOptional()
  type?: MaterialType;

  @IsOptional()
  subtype?: MaterialSubtype;
}
