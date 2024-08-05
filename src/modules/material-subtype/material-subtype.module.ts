import { Module } from '@nestjs/common';
import { MaterialSubtypeService } from './material-subtype.service';
import { MaterialSubtypeController } from './material-subtype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialSubtype } from './material-subtype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialSubtype])],
  providers: [MaterialSubtypeService],
  controllers: [MaterialSubtypeController],
  exports: [MaterialSubtypeService],
})
export class MaterialSubtypeModule {}
