import { Module } from '@nestjs/common';
import { OldDbService } from './old-db.service';
import { OldDbController } from './old-db.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OldBaza } from './old-db.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OldBaza])],
  providers: [OldDbService],
  controllers: [OldDbController]
})
export class OldDbModule {}
