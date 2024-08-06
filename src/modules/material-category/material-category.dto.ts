import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMaterialCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateMaterialCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}
