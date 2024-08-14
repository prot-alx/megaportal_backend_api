import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OldBazaDto } from './old-db.dto';
import { OldBaza } from './old-db.entity';

@Injectable()
export class OldDbService {
  constructor(
    @InjectRepository(OldBaza)
    private readonly oldBazaRepository: Repository<OldBaza>,
  ) {}

  // Метод для поиска записей по полю tel
  async findByTel(tel: number): Promise<OldBazaDto[]> {
    const records = await this.oldBazaRepository.find({ where: { tel } });
    return records.map((record) => this.toDto(record));
  }

  // Метод для преобразования сущности в DTO
  private toDto(entity: OldBaza): OldBazaDto {
    return {
      id: entity.id,
      tel: entity.tel,
      zhaloba: entity.zhaloba,
      adres: entity.adres,
      kt: entity.kt,
      viyavleno: entity.viyavleno,
      ispoln: entity.ispoln,
      datez: entity.datez,
    };
  }
}
