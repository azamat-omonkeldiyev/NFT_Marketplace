import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuctionResultDto {
  @ApiProperty({ example: '3.08' })
  @IsNotEmpty()
  bidAmount: any;

  @ApiProperty({ example: 'auction-uuid' })
  @IsString()
  @IsNotEmpty()
  auctionId: string;

  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsNotEmpty()
  buyerId: string;
}
