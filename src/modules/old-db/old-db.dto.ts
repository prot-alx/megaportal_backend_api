import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsDate, IsNumber } from 'class-validator';

export class OldBazaDto {
  @ApiProperty({
    description: 'Уникальный идентификатор записи',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiPropertyOptional({
    description: 'Телефонный номер',
    example: 123456789,
  })
  @IsOptional()
  @IsNumber()
  tel?: number;

  @ApiPropertyOptional({
    description: 'Жалоба',
    example: 'Не работает оборудование',
  })
  @IsOptional()
  @IsString()
  zhaloba?: string;

  @ApiPropertyOptional({
    description: 'Адрес',
    example: 'Москва, ул. Примерная, д. 1',
  })
  @IsOptional()
  @IsString()
  adres?: string;

  @ApiPropertyOptional({
    description: 'КТ',
    example: 'Примерное значение',
  })
  @IsOptional()
  @IsString()
  kt?: string;

  @ApiPropertyOptional({
    description: 'Выявлено',
    example: 'Неисправность в системе',
  })
  @IsOptional()
  @IsString()
  viyavleno?: string;

  @ApiPropertyOptional({
    description: 'Исполнитель',
    example: 'Иванов И.И.',
  })
  @IsOptional()
  @IsString()
  ispoln?: string;

  @ApiPropertyOptional({
    description: 'Дата закрытия',
    example: '2024-08-14T12:34:56Z',
  })
  @IsOptional()
  @IsDate()
  datez?: Date;
}
