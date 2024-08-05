import { IsString } from 'class-validator';

export class CreateMaterialCategoryDto {
  @IsString()
  name: string;
}

export class UpdateMaterialCategoryDto {
  @IsString()
  name: string;
}
