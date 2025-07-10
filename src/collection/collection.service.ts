import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { QueryCollectionDto } from './dto/collection-query.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCollectionDto, userId: string) {
    return await this.prisma.collection.create({
      data: {
        ...dto,
        creatorId: userId,
      },
    });
  }

  async findAll(query: QueryCollectionDto) {
    const { search, page = 1, limit = 10, creatorId } = query;
  
    const where: any = {};
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (creatorId) {
      where.creatorId = creatorId;
    }
  
    const total = await this.prisma.collection.count({ where });
  
    const collections = await this.prisma.collection.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: true,
      },
    });
  
    const lastPage = Math.ceil(total / limit);
  
    return {
      data: collections,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }
  

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({ where: { id },
      include: {
        creator: true
      }
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    try {
      return await this.prisma.collection.update({
        where: { id },
        data: { ...dto },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.prisma.collection.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException("Can't delete collection. It might have related data.");
    }
  }
}
