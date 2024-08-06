import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.entity';
import { GetAuditLogsDto } from './audit-log.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Audit Logs')
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({
    summary:
      'Получить логи за указанный период с возможной фильтрацией по действию',
  })
  @ApiQuery({ name: 'startDate', type: Date, required: false })
  @ApiQuery({ name: 'endDate', type: Date, required: false })
  @ApiQuery({ name: 'action', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'Return list of audit logs',
    type: [AuditLog],
  })
  @ApiResponse({
    status: 404,
    description: 'No audit logs found for the given criteria',
  })
  @ApiResponse({ status: 500, description: 'Failed to get audit logs' })
  async getLogs(
    @Query() getAuditLogsDto: GetAuditLogsDto,
  ): Promise<AuditLog[]> {
    try {
      const { startDate, endDate, action } = getAuditLogsDto;
      return await this.auditLogService.getLogs(startDate, endDate, action);
    } catch (error) {
      console.error('Error in getLogs controller:', error);
      throw new DetailedInternalServerErrorException(
        'Failed to get audit logs.',
        error.message,
      );
    }
  }
}
