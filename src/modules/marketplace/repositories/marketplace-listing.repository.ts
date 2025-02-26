import { EntityRepository, Repository } from 'typeorm';
import { MarketplaceListing } from '../entities/marketplace-listing.entity';

@EntityRepository(MarketplaceListing)
export class MarketplaceListingRepository extends Repository<MarketplaceListing> {}
