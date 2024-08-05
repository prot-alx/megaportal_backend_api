import { IsString } from 'class-validator';

export class CreateMaterialTypeDto {
  @IsString()
  name: string;
}

export class UpdateMaterialTypeDto {
  @IsString()
  name: string;
}
