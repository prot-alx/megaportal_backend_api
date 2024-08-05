import { IsString, IsEnum, IsOptional, IsDate, IsInt } from 'class-validator';
import { RequestType, RequestStatus } from './requests.entity';

export class CreateRequestDto {
  @IsOptional()
  @IsString()
  epId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsDate()
  requestDate: Date;

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
  hrId?: number; // Optional HR ID for creating or updating
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  epId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  requestDate?: Date;

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
  hrId?: number; // Optional HR ID for updating
}
