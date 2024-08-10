import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RequestStatus } from '../request/requests.entity';

export class RequestDataDto {
  @IsNotEmpty()
  @IsNumber()
  request_id: number;

  @IsNotEmpty()
  @IsNumber()
  performer_id: number;
}

export class ChangeRequestStatusDto {
  @IsEnum(RequestStatus, {
    message:
      'Invalid status. Must be one of: NEW, IN_PROGRESS, SUCCESS, CLOSED, CANCELLED, MONITORING, POSTPONED.',
  })
  status: RequestStatus;
}
