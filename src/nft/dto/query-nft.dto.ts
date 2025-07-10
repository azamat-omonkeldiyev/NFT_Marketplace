import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryNftDto {
  @ApiPropertyOptional({ description: 'NFT search by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page (default: 10)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({description: 'Filter by creatorId' })
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiPropertyOptional({ description: 'Filter by ownerId' })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Sort by field (default: createdAt)' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', description: 'Sort order: asc or desc (default: desc)' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
