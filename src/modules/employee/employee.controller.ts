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
  EmployeeDto,
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
    type: [EmployeeDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении списка сотрудников',
  })
  async findAll(@Query() filterDto: EmployeeDto): Promise<EmployeeDto[]> {
    try {
      const employees = await this.employeeService.findAll(filterDto);
      return employees.map((employee) => new EmployeeDto(employee));
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
  @ApiOperation({
    summary: 'Получить сотрудников по ролям с учетом активности',
  })
  @ApiQuery({
    name: 'roles',
    required: false,
    isArray: true,
    description: 'Роли сотрудников',
    type: String,
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    description: 'Фильтр по активности сотрудников',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Список сотрудников по ролям и активности',
    type: [EmployeeDto],
  })
  @ApiResponse({ status: 404, description: 'Сотрудники не найдены' })
  @ApiResponse({
    status: 500,
    description:
      'Ошибка при получении списка сотрудников по ролям и активности',
  })
  async findByRoles(
    @Query('roles') roles: string | string[], // roles может быть строкой или массивом строк
    @Query('is_active') isActive: string | undefined, // Преобразуем в строку и далее в Boolean
  ): Promise<EmployeeDto[]> {
    try {
      // Преобразование roles в массив
      let rolesArray: string[];
      if (Array.isArray(roles)) {
        rolesArray = roles;
      } else if (roles) {
        rolesArray = roles.split(',');
      } else {
        rolesArray = [];
      }

      // Преобразование строк в перечисление EmployeeRole
      const roleEnumValues: EmployeeRole[] =
        rolesArray.length > 0
          ? rolesArray.map(
              (role) => EmployeeRole[role as keyof typeof EmployeeRole],
            )
          : [];

      // Преобразование is_active из строки в Boolean
      let isActiveBoolean: boolean | undefined;
      if (isActive === 'true') {
        isActiveBoolean = true;
      } else if (isActive === 'false') {
        isActiveBoolean = false;
      } else {
        isActiveBoolean = undefined;
      }

      // Вызываем метод сервиса для поиска сотрудников
      return await this.employeeService.findByRoles(
        roleEnumValues,
        isActiveBoolean,
      );
    } catch (error) {
      console.error('Error in findByRoles:', error);
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
