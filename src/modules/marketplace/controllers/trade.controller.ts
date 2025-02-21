import { Request, Response } from 'express';
import TradeService from '../services/trade.service';
import { CreateTradeDto, UpdateTradeStatusDto } from '../dtos/trade.dto';
import { validate } from 'class-validator';

class TradeController {
  
  async createTrade(req: Request, res: Response): Promise<Response> {
    try {
      const dto = Object.assign(new CreateTradeDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const trade = await TradeService.createTrade(dto);
      return res.status(201).json(trade);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getTradeById(req: Request, res: Response): Promise<Response> {
    try {
      const tradeId = parseInt(req.params.id, 10);
      if (isNaN(tradeId)) {
        return res.status(400).json({ message: 'Invalid trade ID' });
      }

      const trade = await TradeService.getTradeById(tradeId);
      if (!trade) {
        return res.status(404).json({ message: 'Trade not found' });
      }

      return res.status(200).json(trade);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserTrades(req: Request, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const trades = await TradeService.getUserTrades(userId);
      return res.status(200).json(trades);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateTradeStatus(req: Request, res: Response): Promise<Response> {
    try {
      const tradeId = parseInt(req.params.id, 10);
      if (isNaN(tradeId)) {
        return res.status(400).json({ message: 'Invalid trade ID' });
      }

      const dto = Object.assign(new UpdateTradeStatusDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedTrade = await TradeService.updateTradeStatus(tradeId, dto);
      return res.status(200).json(updatedTrade);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new TradeController();
