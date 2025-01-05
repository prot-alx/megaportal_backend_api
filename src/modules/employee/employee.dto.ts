import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EmployeeRole } from './employee.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Логин сотрудника',
    example: 'john_doe',
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: 'Пароль сотрудника',
    example: 'securePassword123',
  })
  @IsString()
  password: string;
}

export class UpdateEmployeeDto {
  @ApiProperty({
    description: 'Внешний идентификатор сотрудника',
    example: 'EXT12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  external_id?: string;

  @ApiProperty({
    description: 'Имя сотрудника',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Пароль сотрудника',
    example: 'newSecurePassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Адрес сотрудника',
    example: '123 Main St, Springfield',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Телефон сотрудника',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Роль сотрудника',
    enum: EmployeeRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @ApiProperty({
    description: 'Активен ли сотрудник',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class EmployeeDto {
  @ApiProperty({ description: 'ID сотрудника', example: 6 })
  id: number;

  @ApiProperty({ description: 'Имя сотрудника', example: 'диспетчер 2' })
  name: string;

  @ApiProperty({ description: 'Роль сотрудника', example: 'Dispatcher' })
  role: string;

  @ApiProperty({ description: 'Статус активности сотрудника', example: true })
  is_active: boolean;

  constructor(partial: Partial<EmployeeDto>) {
    Object.assign(this, partial);
  }
}
