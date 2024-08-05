import { IsInt, IsOptional } from 'class-validator';

export class CreateBackpackEmployeeDto {
  @IsInt()
  employeeId: number;

  @IsInt()
  warehouseFillingId: number;

  @IsInt()
  count: number;
}

export class UpdateBackpackEmployeeDto {
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsInt()
  warehouseFillingId?: number;

  @IsOptional()
  @IsInt()
  count?: number;
}
