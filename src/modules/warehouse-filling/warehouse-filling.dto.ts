import { IsInt, IsOptional } from 'class-validator';

export class CreateWarehouseFillingDto {
  @IsInt()
  materialId: number;

  @IsInt()
  count: number;
}

export class UpdateWarehouseFillingDto {
  @IsOptional()
  @IsInt()
  materialId?: number;

  @IsOptional()
  @IsInt()
  count?: number;
}
