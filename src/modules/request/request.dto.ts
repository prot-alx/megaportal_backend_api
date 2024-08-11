import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { RequestType, RequestStatus } from './requests.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  ep_id?: string;

  @ApiProperty()
  @IsString()
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request_date: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestType)
  type: RequestType;
}

export class UpdateRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  ep_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  client_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  request_date?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  hr_id?: number;
}

export class AddCommentDto {
  @ApiProperty()
  @IsString()
  comment: string;
}