import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class QueryCollectionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    creatorId?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
  }