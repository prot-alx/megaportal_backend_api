import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requests } from './requests.entity';
import { Employee } from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Requests, Employee])],
  providers: [RequestsService],
  controllers: [RequestsController],
})
export class RequestsModule {}
