import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { CreateAuditLogDto } from './audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  // Получение логов за указанный период с возможной фильтрацией по действию
  async getLogs(startDate: Date, endDate: Date, action?: string): Promise<AuditLog[]> {
    const where: any = {
      action_time: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (action) {
      where.action = action;
    }

    return this.auditLogRepository.find({
      where,
      relations: ['employee'],
    });
  }

  // Логирование действий
  async logAction(createAuditLogDto: CreateAuditLogDto): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      employee: { id: createAuditLogDto.employee_id },
      action: createAuditLogDto.action,
      table_name: createAuditLogDto.table_name,
      record_id: createAuditLogDto.record_id,
      details: createAuditLogDto.details,
    });
    await this.auditLogRepository.save(auditLog);
  }
}
