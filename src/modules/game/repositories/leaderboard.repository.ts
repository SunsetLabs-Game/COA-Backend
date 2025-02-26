import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Leaderboard } from '../entities/laderboard.entity';

@Injectable()
export class LeaderboardRepository extends Repository<Leaderboard> {
  constructor(private dataSource: DataSource) {
    const repository = dataSource.getRepository(Leaderboard);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getTopPlayers(limit: number): Promise<Leaderboard[]> {
    return this.createQueryBuilder('leaderboard')
      .orderBy('leaderboard.score', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getPlayerRank(userId: number): Promise<Leaderboard | null> {
    return this.findOne({ where: { userId } });
  }

  async saveEntry(entry: Leaderboard): Promise<void> {
    await this.save(entry);
  }
}
