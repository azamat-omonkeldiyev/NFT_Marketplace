import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionResultDto } from './dto/create-auction-result.dto';
import { UpdateAuctionResultDto } from './dto/update-auction-result.dto';
import { QueryAuctionResultDto } from './dto/query-auction-result.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuctionResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuctionResultDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const result = await tx.auctionResult.create({
          data: dto,
        });
  
        const auction = await tx.auction.findUnique({
          where: { id: dto.auctionId },
        });
  
        if (!auction) {
          throw new BadRequestException('Auction not found');
        }
  
        await tx.nFT.update({
          where: { id: auction.nftId },
          data: { ownerId: dto.buyerId },
        });
  
        return result;
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  async findAll(query: QueryAuctionResultDto) {
    const { search, page = 1, limit = 10, auctionId, buyerId } = query;

    const where: any = {};
    if (search) {
      where.bidAmount = { equals: search };
    }
    if (auctionId) {
      where.auctionId = auctionId;
    }
    if (buyerId) {
      where.buyerId = buyerId;
    }

    const total = await this.prisma.auctionResult.count({ where });

    const results = await this.prisma.auctionResult.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: { auction: true, user: true },
    });

    return {
      data: results,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const result = await this.prisma.auctionResult.findUnique({
      where: { id },
      include: { auction: true, user: true },
    });
    if (!result) {
      throw new NotFoundException('Auction Result not found');
    }
    return result;
  }

  async update(id: string, dto: UpdateAuctionResultDto) {
    await this.findOne(id);
    return await this.prisma.auctionResult.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.prisma.auctionResult.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
