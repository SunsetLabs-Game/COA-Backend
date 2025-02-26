
import { Repository } from 'typeorm';
import { Trade } from '../entities/trade.entity';

export const TradeRepository: Repository<Trade> =
  AppDataSource.getRepository(Trade);

import { getRepository, Repository } from 'typeorm';
import { Trade, TradeStatus } from '../entities/trade.entity';

export class TradeRepository {
  private repo: Repository<Trade>;

  constructor() {
    this.repo = getRepository(Trade);
  }

  async create(tradeData: Partial<Trade>): Promise<Trade> {
    const trade = this.repo.create(tradeData);
    return await this.repo.save(trade);
  }

  async findById(id: number): Promise<Trade | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Trade[]> {
    return await this.repo.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
    });
  }

  async updateTradeStatus(id: number, status: TradeStatus): Promise<void> {
    await this.repo.update(id, { status });
  }
}

