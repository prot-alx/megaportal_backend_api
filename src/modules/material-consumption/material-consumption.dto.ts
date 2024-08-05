import { IsInt, IsBoolean } from 'class-validator';

export class CreateMaterialConsumptionDto {
  @IsInt()
  requestDataId: number;

  @IsInt()
  backpackEmployeeId: number;

  @IsInt()
  count: number;

  @IsBoolean()
  approved: boolean;
}

export class UpdateMaterialConsumptionDto {
  @IsBoolean()
  approved: boolean;
}

