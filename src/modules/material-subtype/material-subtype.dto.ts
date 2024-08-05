import { IsString } from 'class-validator';

export class CreateMaterialSubtypeDto {
  @IsString()
  name: string;
}

export class UpdateMaterialSubtypeDto {
  @IsString()
  name: string;
}
