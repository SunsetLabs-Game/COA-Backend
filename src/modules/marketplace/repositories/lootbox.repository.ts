import { EntityRepository, Repository } from 'typeorm';
import { Lootbox } from '@/modules/marketplace/entities/lootbox.entity';

@EntityRepository(Lootbox)
export class LootboxRepository extends Repository<Lootbox> {
  // Add custom repository methods here if needed.
}
