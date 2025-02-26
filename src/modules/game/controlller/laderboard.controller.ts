import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { LeaderboardService } from '../../game/services/leaderboard.service';
import { LeaderboardDTO } from '../dtos/leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Post('update')
  updateScore(@Body() leaderboardDTO: LeaderboardDTO) {
    return this.leaderboardService.updateScore(
      leaderboardDTO.userId,
      leaderboardDTO.score,
    );
  }

  @Get('top/:limit')
  getTopPlayers(@Param('limit') limit: number) {
    return this.leaderboardService.getTopPlayers(Number(limit));
  }
}
