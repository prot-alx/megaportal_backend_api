import { Module } from '@nestjs/common';
import { RequestDataService } from './request-data.service';
import { RequestDataController } from './request-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestData } from './request-data.entity';
import { Requests } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestData, Requests, Employee])],
  providers: [RequestDataService],
  controllers: [RequestDataController],
  exports: [RequestDataService],
})
export class RequestDataModule {}
