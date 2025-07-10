import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { QueryAuctionDto } from './dto/auction-query.sto';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuctionDto) {
    return await this.prisma.auction.create({ data: dto });
  }

  async findAll(query: QueryAuctionDto) {
    const { search, nftId, page = 1, limit = 10 } = query;

    const where: any = {};
    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }
    if (nftId) {
      where.nftId = nftId;
    }

    const total = await this.prisma.auction.count({ where });

    const data = await this.prisma.auction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { nft: true, results: true },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: { nft: true, results: true },
    });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async update(id: string, dto: UpdateAuctionDto) {
    await this.findOne(id);
    return await this.prisma.auction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      this.prisma.auctionResult.deleteMany({ where: { auctionId: id } })
      return await this.prisma.auction.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
