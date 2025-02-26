import { IsNumber, IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateListingDto {
    @IsNumber()
    @IsNotEmpty()
    sellerId: number;

    @IsNumber()
    @IsNotEmpty()
    itemId: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateListingDto {
    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}