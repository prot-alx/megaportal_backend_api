import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { CreateAuditLogDto } from './audit-log.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getLogs(
    startDate?: Date,
    endDate?: Date,
    action?: string,
  ): Promise<AuditLog[]> {
    try {
      const query = this.auditLogRepository.createQueryBuilder('auditLog');

      if (startDate) {
        query.andWhere('auditLog.action_time >= :startDate', { startDate });
      }

      if (endDate) {
        query.andWhere('auditLog.action_time <= :endDate', { endDate });
      }

      if (action) {
        query.andWhere('auditLog.action = :action', { action });
      }

      const logs = await query.getMany();
      if (!logs.length) {
        throw new NotFoundException(
          'No audit logs found for the given criteria.',
        );
      }

      return logs;
    } catch (error) {
      console.error('Error getting logs:', error);
      throw new DetailedInternalServerErrorException(
        'Failed to get audit logs.',
        error.message,
      );
    }
  }

  async logAction(createAuditLogDto: CreateAuditLogDto): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        employee: { id: createAuditLogDto.employee_id },
        action: createAuditLogDto.action,
        table_name: createAuditLogDto.table_name,
        record_id: createAuditLogDto.record_id,
        details: createAuditLogDto.details,
      });
      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      console.error('Error logging action:', error);
      throw new DetailedInternalServerErrorException(
        'Failed to log action.',
        error.message,
      );
    }
  }
}
