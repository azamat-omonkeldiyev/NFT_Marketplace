import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { NftModule } from './nft/nft.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterController } from './multer/multer.controller';
import { join } from 'path';
import { CollectionModule } from './collection/collection.module';
import { CategoryModule } from './category/category.module';
import { AuctionModule } from './auction/auction.module';
import { AuctionResultModule } from './auction-result/auction-result.module';
import { RankingModule } from './ranking/ranking.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, PrismaModule, MailModule, NftModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    CollectionModule,
    CategoryModule,
    AuctionModule,
    AuctionResultModule,
    RankingModule,
    AdminModule,
  ],
  controllers: [AppController,MulterController],
  providers: [AppService],
})
export class AppModule {}
