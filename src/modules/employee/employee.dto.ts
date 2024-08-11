import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EmployeeRole } from './employee.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateEmployeeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  external_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  @IsString()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}
