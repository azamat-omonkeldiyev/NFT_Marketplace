import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsDateString } from 'class-validator';

export class CreateAuctionDto {
  @ApiProperty({ example: 'Unique NFT Auction' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: ['links', 'links'], type: [String] })
  @IsArray()
  details: string[];

  @ApiProperty({ example: ['Art', 'Digital'], type: [String] })
  @IsArray()
  tags: string[];

  @ApiProperty({ example: '2025-07-15T12:00:00Z' })
  @IsDateString()
  endsAt: string;

  @ApiProperty({ example: 'nft-uuid' })
  @IsNotEmpty()
  @IsString()
  nftId: string;
}
