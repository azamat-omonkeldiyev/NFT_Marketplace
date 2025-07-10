import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UseGuards,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { QueryAuctionDto } from './dto/auction-query.sto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Roles(UserRole.ARTIST,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
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

  @Roles(UserRole.ARTIST,UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Auction' })
  update(@Param('id') id: string, @Body() dto: UpdateAuctionDto) {
    return this.auctionService.update(id, dto);
  }


  @Roles(UserRole.ARTIST,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Auction' })
  remove(@Param('id') id: string) {
    return this.auctionService.remove(id);
  }
}
