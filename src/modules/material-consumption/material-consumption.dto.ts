import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class CreateMaterialConsumptionDto {
  @ApiProperty()
  @IsInt()
  requestDataId: number;

  @ApiProperty()
  @IsInt()
  backpackEmployeeId: number;

  @ApiProperty()
  @IsInt()
  count: number;

  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}

export class UpdateMaterialConsumptionDto {
  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}
