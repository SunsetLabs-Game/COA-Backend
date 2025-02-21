import { Repository } from "typeorm";
import { AppDataSource } from '../../../data-source';
import { Trade } from "../entities/trade.entity";

export const TradeRepository: Repository<Trade> = AppDataSource.getRepository(Trade)

