import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [UserService]
})
export class AdminModule {}

