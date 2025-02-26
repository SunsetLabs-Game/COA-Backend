import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceListing } from '../entities/marketplace-listing.entity';
import {
  CreateMarketplaceListingDto,
  UpdateMarketplaceListingDto,
} from '../dtos/marketplace-listing.dto';

@Injectable()
export class MarketplaceListingService {
  constructor(
    @InjectRepository(MarketplaceListing)
    private marketplaceListingRepository: Repository<MarketplaceListing>,
  ) {}

  async create(dto: CreateMarketplaceListingDto): Promise<MarketplaceListing> {
    const MarketplaceListing = this.marketplaceListingRepository.create(dto);
    return this.marketplaceListingRepository.save(MarketplaceListing);
  }

  async findAll(): Promise<MarketplaceListing[]> {
    return this.marketplaceListingRepository.find({
      where: { isActive: true },
    });
  }

  async update(id: number, dto: UpdateMarketplaceListingDto): Promise<void> {
    await this.marketplaceListingRepository.update(id, dto);
  }
}
