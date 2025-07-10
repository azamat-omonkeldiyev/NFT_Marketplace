import { ApiProperty } from "@nestjs/swagger";

export class QueryRankingDto {
    @ApiProperty({ required: false, enum: ['today', 'week', 'month', 'all'], example: 'week' })
    period?: 'today' | 'week' | 'month' | 'all';
  
    @ApiProperty({ required: false, example: 1 })
    page?: number;
  
    @ApiProperty({ required: false, example: 10 })
    limit?: number;
  }
  