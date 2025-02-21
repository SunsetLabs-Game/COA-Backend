import { Trade, TradeStatus } from '../entities/trade.entity';
import { TradeRepository } from '../repositories/trade.repository';
import { CreateTradeDto, UpdateTradeStatusDto } from '../dtos/trade.dto';

class TradeService {
    
  async createTrade(dto: CreateTradeDto): Promise<Trade> {
    const trade = TradeRepository.create({
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      offeredItemId: dto.offeredItemId,
      requestedItemId: dto.requestedItemId,
      status: TradeStatus.PENDING,  
    });
    return TradeRepository.save(trade);
  }

  async getTradeById(tradeId: number): Promise<Trade | null> {
    return TradeRepository.findOne({ where: { id: tradeId } });
  }

  async getUserTrades(userId: number): Promise<Trade[]> {
    return TradeRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
    });
  }

  async updateTradeStatus(tradeId: number, dto: UpdateTradeStatusDto): Promise<Trade> {
    const trade = await TradeRepository.findOne({ where: { id: tradeId } });
    if (!trade) {
      throw new Error('Trade not found');
    }

    if (!Object.values(TradeStatus).includes(dto.status)) {
      throw new Error('Invalid trade status');
    }

    trade.status = dto.status;
    return TradeRepository.save(trade);
  }
}

export default new TradeService();
