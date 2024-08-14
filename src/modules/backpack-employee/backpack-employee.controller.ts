import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BackpackEmployeeService } from './backpack-employee.service';
import {
  CreateBackpackEmployeeDto,
  MyBackpackDto,
} from './backpack-employee.dto';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRole } from '../employee/employee.entity';

@ApiTags('Backpack')
@ApiBearerAuth()
@Controller('backpack')
@UseGuards(AuthGuard('jwt'))
export class BackpackEmployeeController {
  constructor(
    private readonly backpackEmployeeService: BackpackEmployeeService,
  ) {}

  @Post('transfer')
  @Roles(EmployeeRole.Storekeeper)
  @ApiBody({
    description: 'Данные для передачи материала',
    type: CreateBackpackEmployeeDto,
  })
  async transferMaterial(
    @Body() createBackpackEmployeeDto: CreateBackpackEmployeeDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    return this.backpackEmployeeService.transferMaterial(
      createBackpackEmployeeDto.warehouse_filling_id,
      createBackpackEmployeeDto.employee_id,
      createBackpackEmployeeDto.count,
      token,
    );
  }

  @Post('return')
  @Roles(EmployeeRole.Storekeeper)
  @ApiBody({
    description: 'Данные для возврата материала',
  })
  async returnMaterial(
    @Body() returnMaterialDto: { backpack_employee_id: number; count: number },
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    return this.backpackEmployeeService.returnMaterial(
      returnMaterialDto.backpack_employee_id,
      returnMaterialDto.count,
      token,
    );
  }

  @Get('all-materials')
  @Roles(EmployeeRole.Storekeeper)
  async getAllMaterials() {
    return this.backpackEmployeeService.getAllMaterials();
  }

  @Get('my-materials')
  async getEmployeeMaterials(
    @Headers('authorization') authHeader: string,
  ): Promise<MyBackpackDto[]> {
    const token = authHeader.replace('Bearer ', '');
    return this.backpackEmployeeService.getEmployeeMaterials(token);
  }
}
