import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackpackEmployeeService } from './backpack-employee.service';
import { BackpackEmployeeController } from './backpack-employee.controller';
import { BackpackEmployee } from './backpack-employee.entity';
import { Employee } from '../employee/employee.entity';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackpackEmployee, Employee, WarehouseFilling]),
  ],
  providers: [BackpackEmployeeService],
  controllers: [BackpackEmployeeController],
  exports: [BackpackEmployeeService],
})
export class BackpackEmployeeModule {}
