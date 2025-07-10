import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'My NFT Collection' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: ['https://img1.url', 'https://img2.url'] })
  @IsArray()
  @IsNotEmpty()
  images: string[];

  @ApiProperty({ example: '8.17' })
  @IsNotEmpty()
  price: any;
}