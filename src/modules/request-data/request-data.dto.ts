import { IsInt, IsOptional } from 'class-validator';

export class CreateRequestDataDto {
  @IsInt()
  requestId: number;

  @IsInt()
  executorId: number;

  @IsInt()
  performerId: number;
}

export class UpdateRequestDataDto {
  @IsOptional()
  @IsInt()
  requestId?: number;

  @IsOptional()
  @IsInt()
  executorId?: number;

  @IsOptional()
  @IsInt()
  performerId?: number;
}
