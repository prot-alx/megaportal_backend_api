import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateWarehouseFillingDto {
  @ApiProperty()
  @IsInt()
  materialId: number;

  @ApiProperty()
  @IsInt()
  count: number;
}

export class UpdateWarehouseFillingDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  materialId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  count?: number;
}
