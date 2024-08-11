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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employee')
@UseGuards(AuthGuard('jwt'))
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
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
