import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceListingService } from './services/marketplace-listing.service';
import { MarketplaceListingController } from './controllers/marketplace-listing.controller';
import { MarketplaceListingRepository } from './repositories/marketplace-listing.repository';
import { MarketplaceListing } from './entities/marketplace-listing.entity';

/**
 * Marketplace module
 *
 * Handles marketplace operations including listing, retrieving,
 * and managing NFT sales.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([MarketplaceListing]), // ✅ Ensure entity is registered
  ],
  controllers: [MarketplaceListingController], // ✅ Handles API requests
  providers: [MarketplaceListingService, MarketplaceListingRepository], // ✅ Services and repository logic
  exports: [MarketplaceListingService], // ✅ Export service for use in other modules
})
export class MarketplaceModule {}

import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository]),
    // ... other imports
  ],
  controllers: [ChatController, /* ... other controllers */],
  providers: [ChatService, /* ... other services */],
})
export class MarketplaceModule {} 

