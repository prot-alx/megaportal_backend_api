import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialConsumptionService } from './material-consumption.service';
import { MaterialConsumptionController } from './material-consumption.controller';
import { MaterialConsumption } from './material-consumption.entity';
import { Requests } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';
import { RequestData } from '../request-data/request-data.entity';
import { BackpackEmployee } from '../backpack-employee/backpack-employee.entity'; // Импорт BackpackEmployee
import { JwtService } from '@nestjs/jwt';
import { Material } from '../material/material.entity';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialConsumption,
      Requests,
      Employee,
      RequestData,
      BackpackEmployee,
      WarehouseFilling,
      Material,
    ]),
    AuditLogModule,
  ],
  providers: [MaterialConsumptionService, JwtService],
  controllers: [MaterialConsumptionController],
  exports: [MaterialConsumptionService],
})
export class MaterialConsumptionModule {}
