import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RequestStatus } from '../request/requests.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RequestData } from './request-data.entity';

export class RequestDataDto {
  @ApiProperty({
    description: 'ID заявки',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  request_id: number;

  @ApiProperty({
    description: 'ID исполнителя',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  performer_id: number;
}

export class ChangeRequestStatusDto {
  @ApiProperty({
    description: 'Новый статус заявки',
    example: RequestStatus.NEW,
    enumName: 'RequestStatus',
    enum: [
      RequestStatus.NEW,
      RequestStatus.IN_PROGRESS,
      RequestStatus.SUCCESS,
      RequestStatus.CLOSED,
      RequestStatus.CANCELLED,
      RequestStatus.MONITORING,
      RequestStatus.POSTPONED,
    ],
  })
  @IsEnum(RequestStatus, {
    message:
      'Invalid status. Must be one of: NEW, IN_PROGRESS, SUCCESS, CLOSED, CANCELLED, MONITORING, POSTPONED.',
  })
  status: RequestStatus;
}

export class RequestDataResponseDto {
  @ApiProperty({
    description: 'ID записи',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Дата назначения записи',
    example: '2024-08-14T12:34:56.000Z',
  })
  assigned_at: Date;

  @ApiProperty({
    description: 'ID заявки',
    example: 1,
  })
  request_id: number;

  @ApiProperty({
    description: 'Внешний идентификатор заявки',
    example: 'EP12345',
  })
  ep_id: string;

  @ApiProperty({
    description: 'Идентификатор клиента',
    example: 'CLIENT123',
  })
  client_id: string;

  @ApiProperty({
    description: 'Описание заявки',
    example: 'Необходим ремонт оборудования',
  })
  description: string;

  @ApiProperty({
    description: 'Адрес, к которому относится заявка',
    example: 'ул. Пушкина, д. 10',
  })
  address: string;

  @ApiProperty({
    description: 'Дата заявки',
    example: '2024-08-14T00:00:00.000Z',
  })
  request_date: Date;

  @ApiProperty({
    description: 'Тип заявки',
    example: 'Technical',
  })
  type: string;

  @ApiProperty({
    description: 'Комментарий к заявке',
    example: 'Комментарий добавлен исполнителем',
  })
  comment: string;

  @ApiProperty({
    description: 'Статус заявки',
    example: 'IN_PROGRESS',
  })
  status: string;

  @ApiProperty({
    description: 'Дата создания заявки',
    example: '2024-08-14T12:34:56.000Z',
  })
  request_created_at: Date;

  @ApiProperty({
    description: 'Имя исполнителя',
    example: 'Иванов Иван Иванович',
  })
  executor_name: string;

  @ApiProperty({
    description: 'Имя назначенного исполнителя',
    example: 'Петров Петр Петрович',
  })
  performer_name: string;

  constructor(requestData: RequestData) {
    this.id = requestData.id;
    this.assigned_at = requestData.created_at;
    this.request_id = requestData.request.id;
    this.ep_id = requestData.request.ep_id;
    this.client_id = requestData.request.client_id;
    this.description = requestData.request.description;
    this.address = requestData.request.address;
    this.request_date = requestData.request.request_date;
    this.type = requestData.request.type;
    this.comment = requestData.request.comment;
    this.status = requestData.request.status;
    this.request_created_at = requestData.request.created_at;
    this.executor_name = requestData.executor_id?.name || ''; // Добавлено условие для предотвращения ошибки
    this.performer_name = requestData.performer_id?.name || ''; // Добавлено условие для предотвращения ошибки
  }
}
