import { Module } from '@nestjs/common';
import { WarehouseFillingService } from './warehouse-filling.service';
import { WarehouseFillingController } from './warehouse-filling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseFilling } from './warehouse-filling.entity';
import { Material } from '../material/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseFilling, Material])],
  providers: [WarehouseFillingService],
  controllers: [WarehouseFillingController],
  exports: [WarehouseFillingService],
})
export class WarehouseFillingModule {}
