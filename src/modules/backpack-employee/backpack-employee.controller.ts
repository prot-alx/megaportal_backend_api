import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { BackpackEmployeeService } from './backpack-employee.service';
import { BackpackEmployee } from './backpack-employee.entity';
import { CreateBackpackEmployeeDto, UpdateBackpackEmployeeDto } from './backpack-employee.dto';

@Controller('backpack-employee')
export class BackpackEmployeeController {
  constructor(private readonly backpackEmployeeService: BackpackEmployeeService) {}

  @Post()
  async create(@Body() createBackpackEmployeeDto: CreateBackpackEmployeeDto): Promise<BackpackEmployee> {
    return this.backpackEmployeeService.create(createBackpackEmployeeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBackpackEmployeeDto: UpdateBackpackEmployeeDto,
  ): Promise<BackpackEmployee> {
    return this.backpackEmployeeService.update(id, updateBackpackEmployeeDto);
  }
}
