import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMaterialTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateMaterialTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}
