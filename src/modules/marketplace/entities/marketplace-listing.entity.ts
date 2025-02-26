import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('marketplace_listing')
export class MarketplaceListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nftId: number;

  @Column()
  sellerId: number;

  @Column('decimal')
  price: number;

  @Column({ default: true })
  isActive: boolean;
}
