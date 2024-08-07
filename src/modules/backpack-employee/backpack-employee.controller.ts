import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Query,
  Get,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BackpackEmployeeService } from './backpack-employee.service';
import {
  CreateBackpackEmployeeDto,
  UpdateBackpackEmployeeDto,
} from './backpack-employee.dto';
import { BackpackEmployee } from './backpack-employee.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('backpack-employee')
@UseGuards(AuthGuard('jwt'))
export class BackpackEmployeeController {
  constructor(
    private readonly backpackEmployeeService: BackpackEmployeeService,
  ) {}

  @Post()
  async create(
    @Body() createBackpackEmployeeDto: CreateBackpackEmployeeDto,
    @Query('employeeId') employeeId: number,
  ) {
    return this.backpackEmployeeService.create(
      createBackpackEmployeeDto,
      employeeId,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBackpackEmployeeDto: UpdateBackpackEmployeeDto,
    @Query('employeeId') employeeId: number,
  ) {
    return this.backpackEmployeeService.update(
      id,
      updateBackpackEmployeeDto,
      employeeId,
    );
  }

  // Эндпоинт для получения всех записей для конкретного сотрудника
  @Get('employee/:employeeId')
  async getByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<BackpackEmployee[]> {
    return this.backpackEmployeeService.findByEmployeeId(employeeId);
  }
}
