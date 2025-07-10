import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDecimal } from 'class-validator';

export class CreateNftDto {
  @ApiProperty({ example: 'CryptoPunk' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://image.url' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: '3.15' })
  @IsString()
  @IsDecimal()
  @IsNotEmpty()
  price: string;

  creatorId: string;

  ownerId: string;
}
