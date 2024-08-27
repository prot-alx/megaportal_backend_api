import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee, EmployeeRole } from './employee.entity';
import {
  CreateEmployeeDto,
  EmployeeSummaryDto,
  UpdateEmployeeDto,
} from './employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employee')
@UseGuards(AuthGuard('jwt'))
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех сотрудников' })
  @ApiResponse({
    status: 200,
    description: 'Список всех сотрудников',
    type: [Employee],
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении списка сотрудников',
  })
  async findAll(): Promise<Employee[]> {
    try {
      return await this.employeeService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотрудниках.',
        error.message,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового сотрудника' })
  @ApiBody({
    description: 'Данные для создания нового сотрудника',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Создан новый сотрудник',
    type: Employee,
  })
  @ApiResponse({ status: 500, description: 'Ошибка при создании сотрудника' })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    try {
      return await this.employeeService.create(createEmployeeDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating employee',
        error.message,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить данные сотрудника по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID сотрудника' })
  @ApiBody({
    description: 'Данные для обновления сотрудника',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Обновленный сотрудник',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка при обновлении сотрудника' })
  async update(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    try {
      return await this.employeeService.update(id, updateEmployeeDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error updating employee',
        error.message,
      );
    }
  }

  @Get('filtered')
  @ApiOperation({ summary: 'Получить сотрудников по ролям' })
  @ApiQuery({
    name: 'roles',
    required: false,
    isArray: true,
    description: 'Роли сотрудников',
    type: String, // Убедитесь, что тип указан как String
  })
  @ApiResponse({
    status: 200,
    description: 'Список сотрудников по ролям',
    type: [EmployeeSummaryDto],
  })
  @ApiResponse({ status: 404, description: 'Сотрудники не найдены' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении списка сотрудников по ролям',
  })
  async findByRoles(
    @Query('roles') roles: string[], // Измените тип на string[]
  ): Promise<EmployeeSummaryDto[]> {
    try {
      // Преобразование строковых значений в перечисление EmployeeRole
      const roleEnumValues: EmployeeRole[] = roles.map(
        (role) => EmployeeRole[role as keyof typeof EmployeeRole],
      );
      return await this.employeeService.findByRoles(roleEnumValues);
    } catch (error) {
      console.error('Error in findByRoles:', error); // Логируем ошибку
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотрудниках.',
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить данные сотрудника по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Данные сотрудника',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении данных сотрудника',
  })
  async findOne(@Param('id') id: number): Promise<Employee> {
    try {
      return await this.employeeService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new DetailedInternalServerErrorException(
        'Ошибка получения данных о сотруднике.',
        error.message,
      );
    }
  }
}
