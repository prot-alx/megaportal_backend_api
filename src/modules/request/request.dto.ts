import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { RequestType, RequestStatus } from './requests.entity';

export class CreateRequestDto {
  @IsOptional()
  @IsString()
  ep_id?: string;

  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  request_date: string;

  @IsNotEmpty()
  @IsEnum(RequestType)
  type: RequestType;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus = RequestStatus.NEW;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  ep_id?: string;

  @IsOptional()
  @IsString()
  client_id?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  request_date?: string;

  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsInt()
  hr_id?: number;
}
