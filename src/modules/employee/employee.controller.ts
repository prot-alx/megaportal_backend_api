import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Employee>): Promise<Employee> {
    return this.employeeService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Employee>): Promise<Employee> {
    return this.employeeService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.employeeService.remove(id);
  }
}
