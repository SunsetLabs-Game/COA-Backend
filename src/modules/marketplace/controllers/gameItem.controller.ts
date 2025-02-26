import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameItemService } from '../services/gameItem.service';
import { GameItem } from '../entities/gameItem.entity';
import { CreateGameItemDTO } from '../dtos/gameItem.dto';

@Controller('game-items')
export class GameItemController {
  constructor(private readonly gameItemService: GameItemService) {}

  @Get()
  async getAllItems(): Promise<GameItem[]> {
    return this.gameItemService.getAllItems();
  }

  @Get(':ownerId')
  async getItemsByOwner(
    @Param('ownerId') ownerId: number,
  ): Promise<GameItem[]> {
    return this.gameItemService.getItemsByOwner(ownerId);
  }

  @Post()
  async createItem(@Body() itemData: CreateGameItemDTO): Promise<GameItem> {
    // <-- Cambiar el tipo aquí
    return this.gameItemService.createItem(itemData);
  }
}
