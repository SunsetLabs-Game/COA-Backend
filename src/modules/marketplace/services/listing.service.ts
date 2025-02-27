import { getRepository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { CreateListingDto, UpdateListingDto } from '../dtos/listing.dto';

class ListingService {
    private listingRepository = getRepository(Listing);

    async createListing(createListingDto: CreateListingDto): Promise<Listing> {
        const listing = this.listingRepository.create(createListingDto);
        return this.listingRepository.save(listing);
    }

    async findAllListings(): Promise<Listing[]> {
        return this.listingRepository.find();
    }

    async findOneListing(id: number): Promise<Listing | null> {
        return this.listingRepository.findOne({ where: { id } });
    }

    async updateListing(id: number, updateListingDto: UpdateListingDto): Promise<void> {
        await this.listingRepository.update(id, updateListingDto);
    }

    async removeListing(id: number): Promise<void> {
        await this.listingRepository.delete(id);
    }
}

export default new ListingService();