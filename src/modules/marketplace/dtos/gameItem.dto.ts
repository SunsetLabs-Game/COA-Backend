import {
  IsEnum,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ItemType, Rarity } from '../entities/gameItem.entity';

export class CreateGameItemDTO {
  @IsNotEmpty()
  @IsNumber()
  ownerId: number;

  @IsNotEmpty()
  name: string;

  @IsEnum(ItemType)
  type: ItemType;

  @IsEnum(Rarity)
  rarity: Rarity;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsBoolean()
  isNFT: boolean;
}
