import { Trade, TradeStatus } from '../entities/trade.entity';
import { TradeRepository } from '../repositories/trade.repository';
import { CreateTradeDto, UpdateTradeStatusDto } from '../dtos/trade.dto';

class TradeService {

  private tradeRepository: TradeRepository;

  constructor() {
    this.tradeRepository = new TradeRepository();
  }


  async createTrade(dto: CreateTradeDto): Promise<Trade> {
    const trade = await this.tradeRepository.create({
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      offeredItemId: dto.offeredItemId,
      requestedItemId: dto.requestedItemId,
      status: TradeStatus.PENDING,
    });
    return this.tradeRepository.create(trade);
  }

  async getTradeById(tradeId: number): Promise<Trade | null> {
    return this.tradeRepository.findById(tradeId);
  }

  async getUserTrades(userId: number): Promise<Trade[]> {
    return this.tradeRepository.findByUserId(userId);
  }

  async updateTradeStatus(
    tradeId: number,
    dto: UpdateTradeStatusDto,
  ): Promise<Trade> {

    const trade = await TradeRepository.findOne({ where: { id: tradeId } });

    const trade = await this.tradeRepository.findById(tradeId);

    if (!trade) {
      throw new Error('Trade not found');
    }

    if (!Object.values(TradeStatus).includes(dto.status)) {
      throw new Error('Invalid trade status');
    }

    await this.tradeRepository.updateTradeStatus(tradeId, dto.status);
    return { ...trade, status: dto.status };
  }
}

export default new TradeService();
