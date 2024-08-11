import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RequestStatus } from '../request/requests.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RequestDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  request_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  performer_id: number;
}

export class ChangeRequestStatusDto {
  @ApiProperty()
  @IsEnum(RequestStatus, {
    message:
      'Invalid status. Must be one of: NEW, IN_PROGRESS, SUCCESS, CLOSED, CANCELLED, MONITORING, POSTPONED.',
  })
  status: RequestStatus;
}
