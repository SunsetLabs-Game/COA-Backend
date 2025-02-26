import { getRepository } from 'typeorm';
import { Listing } from '../entities/listing.entity';

export class ListingRepository {
    private repo = getRepository(Listing);

    async create(listingData: Partial<Listing>): Promise<Listing> {
        const listing = this.repo.create(listingData);
        return await this.repo.save(listing);
    }

    async findAll(): Promise<Listing[]> {
        return await this.repo.find();
    }

    async findById(id: number): Promise<Listing | null> {
        return await this.repo.findOne({ where: { id } });
    }

    async update(id: number, updateData: Partial<Listing>): Promise<void> {
        await this.repo.update(id, updateData);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete(id);
    }
}