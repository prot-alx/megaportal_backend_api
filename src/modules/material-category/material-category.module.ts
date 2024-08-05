import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategoryController } from './material-category.controller';
import { MaterialCategory } from './material-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialCategory])],
  providers: [MaterialCategoryService],
  controllers: [MaterialCategoryController],
  exports: [MaterialCategoryService],
})
export class MaterialCategoryModule {}
