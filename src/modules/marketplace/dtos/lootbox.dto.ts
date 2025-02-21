import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsEnum, IsPositive } from 'class-validator';
import { LootboxRarity } from '@/modules/marketplace/entities/lootbox.entity';

export class CreateLootboxDto {
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @IsArray()
  @ArrayNotEmpty()
  items: number[];

  @IsPositive()
  price: number;

  @IsEnum(LootboxRarity)
  rarity: LootboxRarity;
}
