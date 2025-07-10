import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { QueryAuctionDto } from './dto/auction-query.sto';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @ApiOperation({ summary: 'Create Auction' })
  create(@Body() dto: CreateAuctionDto) {
    return this.auctionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Auctions (with Search, Filter, Pagination)' })
  findAll(@Query() query: QueryAuctionDto) {
    return this.auctionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Auction by ID' })
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Auction' })
  update(@Param('id') id: string, @Body() dto: UpdateAuctionDto) {
    return this.auctionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Auction' })
  remove(@Param('id') id: string) {
    return this.auctionService.remove(id);
  }
}
