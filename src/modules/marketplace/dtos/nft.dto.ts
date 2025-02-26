import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateNFTDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  imageUrl: string;

  @IsNumber()
  ownerId: number;

  @IsBoolean()
  isListed?: boolean;

  @IsNumber()
  price?: number;
}

export class UpdateNFTListingDto {
  @IsBoolean()
  isListed: boolean;

  @IsNumber()
  price?: number;
}
