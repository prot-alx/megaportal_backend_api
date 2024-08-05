import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  action: string;

  @IsString()
  tableName: string;

  @IsString()
  recordId: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}