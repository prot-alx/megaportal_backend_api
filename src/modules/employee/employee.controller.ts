import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { AuthGuard } from '@nestjs/passport';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
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
        'Error retrieving employees',
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
        'Error retrieving employee',
        error.message,
      );
    }
  }
}
