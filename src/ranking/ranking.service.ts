import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryRankingDto } from './dto/query-ranking.dto';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getArtistRankings(query: QueryRankingDto) {
    const { period = 'today', page = 1, limit = 10 } = query;

    const now = new Date();
    let startDate: Date, prevStartDate: Date, prevEndDate: Date;
    switch (period) {
      case 'week':
        startDate = subDays(now, 7);
        prevStartDate = subDays(now, 14);
        prevEndDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        prevStartDate = subDays(now, 60);
        prevEndDate = subDays(now, 30);
        break;
      case 'all':
        startDate = new Date(0);
        prevStartDate = new Date(0);
        prevEndDate = new Date(0);
        break;
      case 'today':
      default:
        startDate = subDays(now, 1);
        prevStartDate = subDays(now, 2);
        prevEndDate = subDays(now, 1);
        break;
    }

    const results = await this.prisma.auctionResult.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        auction: {
          include: {
            nft: {
              select: {
                creatorId: true,
                creator: { select: { username: true, image: true } },
              },
            },
          },
        },
      },
    });

    const prevResults = await this.prisma.auctionResult.findMany({
      where: {
        createdAt: {
          gte: prevStartDate,
          lt: prevEndDate,
        },
      },
      include: {
        auction: {
          include: {
            nft: {
              select: {
                creatorId: true,
                creator: { select: { username: true, image: true } },
              },
            },
          },
        },
      },
    });

    const grouped: Record<string, { artistName: string; image: string, nftSold: number; totalRevenue: number }> = {};
    const prevGrouped: Record<string, number> = {};

    for (const result of results) {
      const creatorId = result.auction.nft.creatorId;
      if (!grouped[creatorId]) {
        grouped[creatorId] = {
          artistName: result.auction.nft.creator.username,
          image: result.auction.nft.creator.image,
          nftSold: 0,
          totalRevenue: 0,
        };
      }
      grouped[creatorId].nftSold += 1;
      grouped[creatorId].totalRevenue += Number(result.bidAmount);
    }

    for (const prev of prevResults) {
      const creatorId = prev.auction.nft.creatorId;
      prevGrouped[creatorId] = (prevGrouped[creatorId] || 0) + Number(prev.bidAmount);
    }

    const rankings = Object.entries(grouped).map(([artistId, data]) => {
      const previousRevenue = prevGrouped[artistId] || 0;
      const growth =
        previousRevenue > 0
          ? ((data.totalRevenue - previousRevenue) / previousRevenue) * 100
          : data.totalRevenue > 0
          ? 100
          : 0;
      return {
        artistId,
        ...data,
        growth: Number(growth.toFixed(2)),
      };
    });

    const total = rankings.length;
    const paginated = rankings.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
