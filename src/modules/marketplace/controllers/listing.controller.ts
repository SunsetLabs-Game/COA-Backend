import { Request, Response } from 'express';
import ListingService from '../services/listing.service';
import { CreateListingDto, UpdateListingDto } from '../dtos/listing.dto';
import { validate } from 'class-validator';

class ListingController {
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const dto = Object.assign(new CreateListingDto(), req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const listing = await ListingService.createListing(dto);
            return res.status(201).json(listing);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const listings = await ListingService.findAllListings();
            return res.status(200).json(listings);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async findOne(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid listing ID' });
            }

            const listing = await ListingService.findOneListing(id);
            if (!listing) {
                return res.status(404).json({ message: 'Listing not found' });
            }
            return res.status(200).json(listing);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid listing ID' });
            }

            const dto = Object.assign(new UpdateListingDto(), req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            await ListingService.updateListing(id, dto);
            return res.status(200).json({ message: 'Listing updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async remove(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid listing ID' });
            }

            await ListingService.removeListing(id);
            return res.status(200).json({ message: 'Listing deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new ListingController();