import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogRepository.find();
  }

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    const newAuditLog = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(newAuditLog);
  }

  async findOne(id: number): Promise<AuditLog> {
    return this.auditLogRepository.findOne({ where: { id } });
  }
}
