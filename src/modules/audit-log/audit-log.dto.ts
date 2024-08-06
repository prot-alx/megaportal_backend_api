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

export class UpdateAuditLogDto {
  @IsOptional()
  @IsInt()
  employee_id?: number;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  table_name?: string;

  @IsOptional()
  @IsInt()
  record_id?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

export class GetAuditLogsDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  action?: string;
}
