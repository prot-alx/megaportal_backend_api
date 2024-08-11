import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsObject, IsInt, IsDate } from 'class-validator';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsInt()
  employee_id: number;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  table_name: string;

  @ApiProperty()
  @IsInt()
  record_id: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

export class GetAuditLogsDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  action?: string;
}
