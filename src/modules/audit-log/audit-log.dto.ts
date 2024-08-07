import { Type } from 'class-transformer';
import { IsString, IsOptional, IsObject, IsInt, IsDate } from 'class-validator';

export class CreateAuditLogDto {
  @IsInt()
  employee_id: number;

  @IsString()
  action: string;

  @IsString()
  table_name: string;

  @IsInt()
  record_id: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

export class GetAuditLogsDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  action?: string;
}
