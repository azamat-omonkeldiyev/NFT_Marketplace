import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { Prisma } from '@prisma/client';
import { QueryNftDto } from './dto/query-nft.dto';

@Injectable()
export class NftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNftDto) {
    try {
      const nft = await this.prisma.nFT.create({ data: dto });
      return nft;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(params: QueryNftDto) {
    const {
      page = 1,            
      limit = 10,         
      search,
      creatorId,
      ownerId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
  
    const skip = (page - 1) * limit;
  
    const where: Prisma.NFTWhereInput = {};
  
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
  
    if (creatorId) {
      where.creatorId = creatorId;
    }
  
    if (ownerId) {
      where.ownerId = ownerId;
    }
  
    const nfts = await this.prisma.nFT.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: { creator: true, owner: true, auctions: true },
    });
  
    const total = await this.prisma.nFT.count({ where });
  
    return {
      data: nfts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }  

  async findOne(id: string) {
    const nft = await this.prisma.nFT.findUnique({
      where: { id },
      include: { creator: true, owner: true, auctions: true },
    });
    if (!nft) throw new NotFoundException('NFT not found');
    return nft;
  }

  async update(id: string, dto: UpdateNftDto) {
    await this.findOne(id);
    try {
      return await this.prisma.nFT.update({
        where: { id },
        data: dto
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
  
    try {
      await this.prisma.$transaction(async (tx) => {
        const auctions = await tx.auction.findMany({
          where: { nftId: id },
          select: { id: true },
        });
  
        const auctionIds = auctions.map((auction) => auction.id);
  
        if (auctionIds.length > 0) {
          await tx.auctionResult.deleteMany({
            where: { auctionId: { in: auctionIds } },
          });
        }
  
        await tx.auction.deleteMany({
          where: { nftId: id },
        });
  
        await tx.nFT.delete({
          where: { id },
        });
      });
  
      return { message: 'NFT va unga bog‘liq ma’lumotlar muvaffaqiyatli o‘chirildi.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }  
}
