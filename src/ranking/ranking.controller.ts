import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { ApiQuery } from '@nestjs/swagger';
import { QueryRankingDto } from './dto/query-ranking.dto';

@Controller('ranking')
export class RankingController {
  constructor(private readonly analyticsService: RankingService) {}

  @Get('/rankings')
  @ApiQuery({ name: 'period', required: false, enum: ['today', 'week', 'month', 'all'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRankings(@Query() query: QueryRankingDto) {
    return this.analyticsService.getArtistRankings(query);
  }
}
