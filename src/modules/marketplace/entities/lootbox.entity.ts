import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum LootboxRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum LootboxStatus {
  UNOPENED = 'UNOPENED',
  OPENED = 'OPENED',
}

@Entity()
export class Lootbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  // Store IDs of potential items/NFTs
  @Column("int", { array: true })
  items: number[];

  @Column("decimal")
  price: number;

  @Column({
    type: 'enum',
    enum: LootboxRarity,
    default: LootboxRarity.COMMON,
  })
  rarity: LootboxRarity;

  @Column({
    type: 'enum',
    enum: LootboxStatus,
    default: LootboxStatus.UNOPENED,
  })
  status: LootboxStatus;

  @CreateDateColumn()
  createdAt: Date;
}
