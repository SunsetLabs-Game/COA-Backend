import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameItem } from '../entities/gameItem.entity';
import { CreateGameItemDTO } from '../dtos/gameItem.dto';

@Injectable()
export class GameItemService {
  constructor(
    @InjectRepository(GameItem)
    private readonly gameItemRepository: Repository<GameItem>,
  ) {}

  async getAllItems(): Promise<GameItem[]> {
    return this.gameItemRepository.find();
  }

  async getItemsByOwner(ownerId: number): Promise<GameItem[]> {
    return this.gameItemRepository.find({ where: { ownerId } });
  }

  async createItem(itemData: CreateGameItemDTO): Promise<GameItem> {
    const newItem = this.gameItemRepository.create(itemData);
    return this.gameItemRepository.save(newItem);
  }
}
