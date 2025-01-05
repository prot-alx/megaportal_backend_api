import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RequestStatus, RequestType } from '../request/requests.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RequestData } from './request-data.entity';
import { EmployeeDto } from '../employee/employee.dto';
import { Type } from 'class-transformer';

// DTO для RequestData
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

// DTO для изменения статуса заявки
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

// DTO для создания заявки
export class CreateRequestDto {
  @ApiProperty({
    description: 'Внешний идентификатор заявки',
    example: 'EP12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  ep_id?: string;

  @ApiProperty({
    description: 'Идентификатор клиента',
    example: 'CLIENT123',
  })
  @IsString()
  client_id: string;

  @ApiProperty({
    description: 'Контактные данные клиента',
    example: 'номер телефона',
  })
  @IsString()
  client_contacts: string;

  @ApiProperty({
    description: 'Описание заявки',
    example: 'Необходим ремонт оборудования',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Адрес, к которому относится заявка',
    example: 'ул. Пушкина, д. 10',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Дата заявки в формате строки',
    example: '2024-08-14',
  })
  @IsNotEmpty()
  @IsString()
  request_date: string;

  @ApiProperty({
    description: 'Тип заявки',
    enum: RequestType,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @ApiProperty({
    description: 'Комментарий к заявке',
    example: 'Комментарий добавлен исполнителем',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Статус заявки',
    enum: RequestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiProperty({
    description: 'Информация о сотруднике, создавшем заявку',
    type: EmployeeDto,
  })
  hr_id: EmployeeDto; // Используем EmployeeDto вместо числа
}

// Ответ DTO для RequestData с данными заявки и назначенными сотрудниками
export class RequestDataResponseDto {
  @ApiProperty({
    description: 'ID записи',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID заявки',
    example: 1,
  })
  request_id: number;

  @ApiProperty({
    description: 'Кто оформил заявку',
    example: 1,
  })
  hr: EmployeeDto;

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
    description: 'Адрес заявки',
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
    example: 'VIP, Default',
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
    description: 'Дата последнего изменения заявки',
    example: '2024-08-14T12:34:56.000Z',
  })
  request_updated_at: Date;

  @ApiProperty({
    description: 'ID исполнителя',
    example: '1',
  })
  executor: EmployeeDto;

  @ApiProperty({
    description: 'ID назначенного исполнителя',
    example: '1',
  })
  performer: EmployeeDto;

  constructor(requestData: RequestData) {
    this.id = requestData.id;
    this.request_id = requestData.request.id;
    this.ep_id = requestData.request.ep_id;
    this.hr = requestData.request.hr_id
      ? new EmployeeDto({
          id: requestData.request.hr_id.id,
          name: requestData.request.hr_id.name,
          role: requestData.request.hr_id.role,
          is_active: requestData.request.hr_id.is_active,
        })
      : null;
    this.client_id = requestData.request.client_id;
    this.description = requestData.request.description;
    this.address = requestData.request.address;
    this.request_date = requestData.request.request_date;
    this.type = requestData.request.type;
    this.comment = requestData.request.comment;
    this.status = requestData.request.status;
    this.request_created_at = requestData.request.created_at;
    this.request_updated_at = requestData.request.updated_at;
    this.executor = requestData.executor_id
      ? new EmployeeDto({
          id: requestData.executor_id.id,
          name: requestData.executor_id.name,
          role: requestData.executor_id.role,
          is_active: requestData.executor_id.is_active,
        })
      : null;

    this.performer = requestData.performer_id
      ? new EmployeeDto({
          id: requestData.performer_id.id,
          name: requestData.performer_id.name,
          role: requestData.performer_id.role,
          is_active: requestData.performer_id.is_active,
        })
      : null;
  }
}

export class FilterOptionsDto {
  @IsOptional()
  @IsEnum(RequestStatus, {
    message:
      'Invalid status. Must be one of: NEW, IN_PROGRESS, SUCCESS, CLOSED, CANCELLED, MONITORING, POSTPONED.',
  })
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(RequestType, {
    message: 'Invalid type. Must be one of: VIP, Default.',
  })
  type?: RequestType;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsDateString()
  closed_start_date?: string;

  @IsOptional()
  @IsDateString()
  closed_end_date?: string;

  @IsOptional()
  @IsNumber()
  performer_id?: number;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;
}

export class RequestFilterDto {
  @IsOptional()
  @IsEnum(RequestType, { each: true })
  type?: RequestType[];

  @IsOptional()
  @IsEnum(RequestStatus, { each: true })
  status?: RequestStatus[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  executor_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  performer_id?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  request_date_from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  request_date_to?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updated_at_from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updated_at_to?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
