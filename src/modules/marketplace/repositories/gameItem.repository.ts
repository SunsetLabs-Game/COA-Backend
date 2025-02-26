import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameItem } from '../entities/gameItem.entity';

@Injectable()
export class GameItemRepository extends Repository<GameItem> {
  constructor(
    @InjectRepository(GameItem)
    private readonly repository: Repository<GameItem>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByOwner(ownerId: number): Promise<GameItem[]> {
    return this.repository.find({ where: { ownerId } });
  }
}
