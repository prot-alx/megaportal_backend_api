import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { RequestType, RequestStatus, Requests } from './requests.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestTypeDto {
  @IsNotEmpty()
  @IsEnum(RequestType)
  new_type: RequestType;
}

export class UpdateRequestDateDto {
  new_request_date: string;
}
export class RequestUpdate {
  client_id?: string;
  ep_id?: string;
  description?: string;
  address?: string;
  client_contacts?: string;
}

export class RequestLastUpdateDto {
  updated_at: string;
}

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
}

export class UpdateRequestDto {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  client_id?: string;

  @ApiProperty({
    description: 'Контактные данные клиента',
    example: 'номер телефона',
    required: false,
  })
  @IsOptional()
  @IsString()
  client_contacts?: string;

  @ApiProperty({
    description: 'Описание заявки',
    example: 'Необходим ремонт оборудования',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Адрес, к которому относится заявка',
    example: 'ул. Пушкина, д. 10',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Дата заявки в формате строки',
    example: '2024-08-14',
    required: false,
  })
  @IsOptional()
  @IsString()
  request_date?: string;

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
    example: 'Заявка закрыта после выполнения работ',
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
    description: 'ID сотрудника, ответственного за заявку',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  hr_id?: number;
}

export class AddCommentDto {
  @ApiProperty({
    description: 'Комментарий к заявке',
    example: 'Комментарий добавлен исполнителем',
  })
  @IsString()
  comment: string;
}

export class RequestResponseDto {
  @ApiProperty({
    description: 'ID заявки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Внешний идентификатор заявки',
    example: 'EP12345',
    required: false,
  })
  ep_id?: string;

  @ApiProperty({
    description: 'Идентификатор клиента',
    example: 'CLIENT123',
  })
  client_id: string;

  @ApiProperty({
    description: 'Контактные данные клиента',
    example: 'номер телефона',
    required: false,
  })
  @IsOptional()
  @IsString()
  client_contacts?: string;

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
    description: 'Дата заявки в формате Date',
    example: '2024-08-14T00:00:00.000Z',
  })
  request_date: Date;

  @ApiProperty({
    description: 'Тип заявки',
    enum: RequestType,
  })
  type: RequestType;

  @ApiProperty({
    description: 'Комментарий к заявке',
    example: 'Комментарий добавлен исполнителем',
    required: false,
  })
  comment?: string;

  @ApiProperty({
    description: 'Статус заявки',
    enum: RequestStatus,
  })
  status: RequestStatus;

  @ApiProperty({
    description: 'Дата создания заявки',
    example: '2024-08-14T12:34:56.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Дата последнего обновления заявки',
    example: '2024-08-15T12:34:56.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Имя сотрудника, создавшего заявку',
    example: 'Иванов Иван Иванович',
  })
  hr_name: string;

  constructor(request: Requests) {
    this.id = request.id;
    this.ep_id = request.ep_id;
    this.client_id = request.client_id;
    this.client_contacts = request.client_contacts;
    this.description = request.description;
    this.address = request.address;
    this.request_date = request.request_date;
    this.type = request.type;
    this.comment = request.comment;
    this.status = request.status;
    this.created_at = request.created_at;
    this.updated_at = request.updated_at;
    this.hr_name = request.hr_id.name;
  }
}
