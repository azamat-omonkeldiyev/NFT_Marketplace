import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { NftService } from './nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { QueryNftDto } from './dto/query-nft.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/user/decorators/role.decorator';

@ApiTags('NFTs')
@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Roles(UserRole.ARTIST,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create NFT' })
  @ApiResponse({ status: 201, description: 'NFT successfully created' })
  create(@Body() dto: CreateNftDto, @Req() req: Request) {
  dto.creatorId = req['user-id'];  
  dto.ownerId = req['user-id'];
  return this.nftService.create(dto);
}

  @Get()
  @ApiOperation({ summary: 'Get All NFTs with Search & Pagination' })
  findAll(@Query() query: QueryNftDto) {
    return this.nftService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NFT by ID' })
  findOne(@Param('id') id: string) {
    return this.nftService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update NFT (PATCH)' })
  update(@Param('id') id: string, @Body() dto: UpdateNftDto) {
    return this.nftService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete NFT' })
  remove(@Param('id') id: string) {
    return this.nftService.remove(id);
  }
}
