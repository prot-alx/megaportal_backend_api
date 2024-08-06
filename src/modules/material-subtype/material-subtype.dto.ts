import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMaterialSubtypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateMaterialSubtypeDto {
  @ApiProperty()
  @IsString()
  name: string;
}
