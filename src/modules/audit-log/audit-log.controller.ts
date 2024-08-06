import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.entity';
import { GetAuditLogsDto } from './audit-log.dto';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // Получение логов за указанный период с возможной фильтрацией по действию
  @Get()
  async getLogs(
    @Query() getAuditLogsDto: GetAuditLogsDto,
  ): Promise<AuditLog[]> {
    const { startDate, endDate, action } = getAuditLogsDto;
    return this.auditLogService.getLogs(startDate, endDate, action);
  }
}
