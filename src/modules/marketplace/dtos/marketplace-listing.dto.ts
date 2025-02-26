import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class CreateMarketplaceListingDto {
  @IsNumber()
  nftId: number;

  @IsNumber()
  sellerId: number;

  @IsPositive()
  price: number;
}

export class UpdateMarketplaceListingDto {
  @IsBoolean()
  isActive: boolean;
}
