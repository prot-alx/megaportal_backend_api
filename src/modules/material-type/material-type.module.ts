import { Module } from '@nestjs/common';
import { MaterialTypeService } from './material-type.service';
import { MaterialTypeController } from './material-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialType } from './material-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialType])],
  providers: [MaterialTypeService],
  controllers: [MaterialTypeController],
  exports: [MaterialTypeService],
})
export class MaterialTypeModule {}
