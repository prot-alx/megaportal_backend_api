import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { Material } from './material.entity';
import { MaterialCategory } from '../material-category/material-category.entity';
import { MaterialType } from '../material-type/material-type.entity';
import { MaterialSubtype } from '../material-subtype/material-subtype.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material, MaterialCategory, MaterialType, MaterialSubtype]),
  ],
  providers: [MaterialService],
  controllers: [MaterialController],
  exports: [MaterialService],
})
export class MaterialModule {}
