import { Module } from '@nestjs/common';
import { RequestDataService } from './request-data.service';
import { RequestDataController } from './request-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestData } from './request-data.entity';
import { Requests } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeService } from '../employee/employee.service';
import { RequestsService } from '../request/requests.service';
import { JwtService } from '@nestjs/jwt';
import { RequestUpdatesGateway } from './request-updates.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([RequestData, Requests, Employee])],
  providers: [RequestDataService, RequestsService, EmployeeService, JwtService, RequestUpdatesGateway],
  controllers: [RequestDataController],
  exports: [RequestDataService],
})
export class RequestDataModule {}
