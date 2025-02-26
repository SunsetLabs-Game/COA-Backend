import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Lootbox,
  LootboxStatus,
} from '@/modules/marketplace/entities/lootbox.entity';
import { LootboxRepository } from '@/modules/marketplace/repositories/lootbox.repository';
import { CreateLootboxDto } from '@/modules/marketplace/dtos/lootbox.dto';

@Injectable()
export class LootboxService {
  constructor(
    @InjectRepository(Lootbox)
    private readonly lootboxRepository: LootboxRepository,
  ) {}

  async purchaseLootbox(createLootboxDto: CreateLootboxDto): Promise<Lootbox> {
    const lootbox = this.lootboxRepository.create({
      ownerId: createLootboxDto.ownerId,
      items: createLootboxDto.items,
      price: createLootboxDto.price,
      rarity: createLootboxDto.rarity,
      status: LootboxStatus.UNOPENED,
    });
    return this.lootboxRepository.save(lootbox);
  }

  async openLootbox(id: number): Promise<{ reward: number; lootbox: Lootbox }> {
    const lootbox = await this.lootboxRepository.findOne({ where: { id } });
    if (!lootbox) {
      throw new NotFoundException('Lootbox not found');
    }
    if (lootbox.status === LootboxStatus.OPENED) {
      throw new BadRequestException('Lootbox already opened');
    }

    // Randomly select a reward from the available items.
    const randomIndex = Math.floor(Math.random() * lootbox.items.length);
    const reward = lootbox.items[randomIndex];

    // Mark the lootbox as opened.
    lootbox.status = LootboxStatus.OPENED;
    await this.lootboxRepository.save(lootbox);

    return { reward, lootbox };
  }

  async getLootboxById(id: number): Promise<Lootbox> {
    const lootbox = await this.lootboxRepository.findOne({ where: { id } });
    if (!lootbox) {
      throw new NotFoundException('Lootbox not found');
    }
    return lootbox;
  }
}
