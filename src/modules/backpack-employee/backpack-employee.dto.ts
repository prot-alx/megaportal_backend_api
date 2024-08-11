import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateBackpackEmployeeDto {
  @ApiProperty()
  @IsInt()
  employeeId: number;

  @ApiProperty()
  @IsInt()
  warehouseFillingId: number;

  @ApiProperty()
  @IsInt()
  count: number;
}

export class UpdateBackpackEmployeeDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  warehouseFillingId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  count?: number;
}
