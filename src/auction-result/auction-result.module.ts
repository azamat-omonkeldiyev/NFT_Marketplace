import { Module } from '@nestjs/common';
import { AuctionResultService } from './auction-result.service';
import { AuctionResultController } from './auction-result.controller';

@Module({
  controllers: [AuctionResultController],
  providers: [AuctionResultService],
})
export class AuctionResultModule {}
