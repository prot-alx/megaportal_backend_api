import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.entity';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(): Promise<AuditLog[]> {
    return this.auditLogService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditLogService.create(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AuditLog> {
    return this.auditLogService.findOne(id);
  }
}
