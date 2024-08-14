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
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
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
  @ApiOkResponse({
    description: 'Материал успешно передан.',
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации. Токен отсутствует или некорректен.',
  })
  @ApiBadRequestResponse({
    description: 'Ошибка запроса. Некорректные данные.',
  })
  @ApiOperation({
    summary: 'Передать материал сотруднику',
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
  @ApiOkResponse({
    description: 'Материал успешно возвращён.',
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации. Токен отсутствует или некорректен.',
  })
  @ApiBadRequestResponse({
    description: 'Ошибка запроса. Некорректные данные.',
  })
  @ApiOperation({
    summary: 'Вернуть материалы на склад',
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
  @ApiOkResponse({
    description: 'Список всех материалов.',
    type: [CreateBackpackEmployeeDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации. Токен отсутствует или некорректен.',
  })
  @ApiOperation({
    summary: 'Получить все материалы, которые у сотрудников.',
  })
  async getAllMaterials() {
    return this.backpackEmployeeService.getAllMaterials();
  }

  @Get('my-materials')
  @ApiOkResponse({
    description: 'Список материалов сотрудника.',
    type: [MyBackpackDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Ошибка авторизации. Токен отсутствует или некорректен.',
  })
  @ApiOperation({
    summary: 'Получить свои материалы (для исполнителей)',
  })
  async getEmployeeMaterials(
    @Headers('authorization') authHeader: string,
  ): Promise<MyBackpackDto[]> {
    const token = authHeader.replace('Bearer ', '');
    return this.backpackEmployeeService.getEmployeeMaterials(token);
  }
}
