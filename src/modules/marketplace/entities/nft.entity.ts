import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'nfts' })
export class NFT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  ownerId: number;

  @Column({ default: false })
  isListed: boolean;

  @Column({ type: 'float', default: 0 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
