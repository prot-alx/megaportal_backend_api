import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseFillingService } from './warehouse-filling.service';
import { WarehouseFillingController } from './warehouse-filling.controller';
import { WarehouseFilling } from './warehouse-filling.entity';
import { Material } from '../material/material.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { Employee } from '../employee/employee.entity'; // Импортируем сущность сотрудника
import { JwtModule } from '@nestjs/jwt'; // Для работы с токенами
import { EmployeeModule } from '../employee/employee.module'; // Импортируем EmployeeModule

@Module({
  imports: [
    TypeOrmModule.forFeature([WarehouseFilling, Material, Employee]),
    AuditLogModule,
    JwtModule.register({}), // Настройте JWT модуль по необходимости
    EmployeeModule, // Импортируем модуль сотрудников
  ],
  providers: [WarehouseFillingService],
  controllers: [WarehouseFillingController],
})
export class WarehouseFillingModule {}
