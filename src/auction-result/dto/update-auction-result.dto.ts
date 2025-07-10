import { PartialType } from '@nestjs/swagger';
import { CreateAuctionResultDto } from './create-auction-result.dto';

export class UpdateAuctionResultDto extends PartialType(CreateAuctionResultDto) {}
