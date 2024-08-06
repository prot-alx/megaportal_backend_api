import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackpackEmployeeService } from './backpack-employee.service';
import { BackpackEmployeeController } from './backpack-employee.controller';
import { BackpackEmployee } from './backpack-employee.entity';
import { Employee } from '../employee/employee.entity';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BackpackEmployee, Employee, WarehouseFilling]),
    AuditLogModule,
  ],
  providers: [BackpackEmployeeService],
  controllers: [BackpackEmployeeController],
  exports: [BackpackEmployeeService],
})
export class BackpackEmployeeModule {}
