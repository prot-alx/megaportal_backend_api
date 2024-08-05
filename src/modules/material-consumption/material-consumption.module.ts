import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialConsumptionService } from './material-consumption.service';
import { MaterialConsumptionController } from './material-consumption.controller';
import { MaterialConsumption } from './material-consumption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialConsumption])],
  providers: [MaterialConsumptionService],
  controllers: [MaterialConsumptionController],
  exports: [MaterialConsumptionService],
})
export class MaterialConsumptionModule {}
