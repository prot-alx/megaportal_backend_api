import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BackpackEmployeeService } from './backpack-employee.service';
import { BackpackEmployee } from './backpack-employee.entity';

@Controller('backpack-employee')
export class BackpackEmployeeController {
  constructor(private readonly backpackEmployeeService: BackpackEmployeeService) {}

  @Get()
  async findAll(): Promise<BackpackEmployee[]> {
    return this.backpackEmployeeService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<BackpackEmployee>): Promise<BackpackEmployee> {
    return this.backpackEmployeeService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<BackpackEmployee>): Promise<BackpackEmployee> {
    return this.backpackEmployeeService.update(id, data);
  }
}
