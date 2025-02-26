import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { MarketplaceListingService } from '../services/marketplace-listing.service';
import {
  CreateMarketplaceListingDto,
  UpdateMarketplaceListingDto,
} from '../dtos/marketplace-listing.dto';

@Controller('marketplace-listing')
export class MarketplaceListingController {
  constructor(
    private readonly MarketplaceListingService: MarketplaceListingService,
  ) {}

  @Post()
  create(@Body() dto: CreateMarketplaceListingDto) {
    return this.MarketplaceListingService.create(dto);
  }

  @Get()
  findAll() {
    return this.MarketplaceListingService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateMarketplaceListingDto) {
    return this.MarketplaceListingService.update(id, dto);
  }
}
