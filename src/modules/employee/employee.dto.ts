import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EmployeeRole } from './employee.entity';

export class CreateEmployeeDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  external_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UserResponseDto {
  @IsString()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;
}
