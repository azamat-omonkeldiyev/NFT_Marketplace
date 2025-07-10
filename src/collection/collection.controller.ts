import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { QueryCollectionDto } from './dto/collection-query.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Collections')
@Controller('collections')  
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Roles(UserRole.ARTIST,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new Collection' })
  create(@Body() dto: CreateCollectionDto, @Req() req: Request) {
    const userId = req['user-id'];
    return this.collectionService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Collections with Search & Pagination' })
  findAll(@Query() query: QueryCollectionDto) {
    return this.collectionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get One Collection by ID' })
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Roles(UserRole.ARTIST,UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Collection (Partial)' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(id, dto);
  }

  @Roles(UserRole.ARTIST,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Collection' })
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
