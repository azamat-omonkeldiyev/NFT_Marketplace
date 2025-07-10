import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Abstract Art' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://image.url/category.png' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'icon-name' })
  @IsString()
  @IsNotEmpty()
  icon: string;
}
