import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './entities/laderboard.entity';
import { LeaderboardRepository } from './repositories/leaderboard.repository';
import { LeaderboardService } from './services/leaderboard.service';
import { LeaderboardController } from './controlller/laderboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardRepository],
  exports: [LeaderboardService],
})
export class LaderboardModule {}
