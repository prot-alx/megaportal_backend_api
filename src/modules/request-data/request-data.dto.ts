import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestDataDto {
  @IsNotEmpty()
  @IsNumber()
  request_id: number;

  @IsNotEmpty()
  @IsNumber()
  performer_id: number;
}
