import { Injectable } from '@nestjs/common';
import { LeaderboardRepository } from '../repositories/leaderboard.repository';
import { Leaderboard } from '../../game/entities/laderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(private leaderboardRepository: LeaderboardRepository) {}

  async updateScore(userId: number, score: number): Promise<void> {
    let entry = await this.leaderboardRepository.getPlayerRank(userId);
    if (!entry) {
      entry = new Leaderboard();
      entry.userId = userId;
      entry.score = score;
    } else {
      entry.score += score;
    }
    await this.leaderboardRepository.saveEntry(entry);
  }

  async getTopPlayers(limit: number) {
    return this.leaderboardRepository.getTopPlayers(limit);
  }
}
