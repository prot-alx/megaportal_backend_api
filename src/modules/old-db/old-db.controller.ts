import { Controller, Get, Query } from '@nestjs/common';
import { OldBazaDto } from './old-db.dto';
import { OldDbService } from './old-db.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('OldDataBase')
@Controller('old')
export class OldDbController {
  constructor(private readonly oldBazaService: OldDbService) {}

  // Эндпоинт для поиска записей по полю tel из старой базы
  @Get('find')
  @ApiOperation({ summary: 'Найти старые заявки по номеру телефона' })
  @ApiQuery({
    name: 'tel',
    type: Number,
    description: 'Телефонный номер для поиска',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Список записей, соответствующих указанному номеру телефона',
    type: [OldBazaDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Записи не найдены',
  })
  async findByTel(@Query('tel') tel: number): Promise<OldBazaDto[]> {
    return this.oldBazaService.findByTel(tel);
  }
}
