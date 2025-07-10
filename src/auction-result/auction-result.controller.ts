import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuctionResultService } from './auction-result.service';
import { CreateAuctionResultDto } from './dto/create-auction-result.dto';
import { UpdateAuctionResultDto } from './dto/update-auction-result.dto';
import { QueryAuctionResultDto } from './dto/query-auction-result.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Auction Results')
@Controller('auction-results')
export class AuctionResultController {
  constructor(private readonly service: AuctionResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create Auction Result' })
  create(@Body() dto: CreateAuctionResultDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Auction Results with Search & Pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'auctionId', required: false })
  @ApiQuery({ name: 'buyerId', required: false })
  findAll(@Query() query: QueryAuctionResultDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Auction Result by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Auction Result by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateAuctionResultDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Auction Result by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
