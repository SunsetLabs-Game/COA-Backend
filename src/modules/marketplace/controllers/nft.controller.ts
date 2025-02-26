import { Request, Response } from 'express';
import NFTService from '../services/nft.service';
import { CreateNFTDto, UpdateNFTListingDto } from '../dtos/nft.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class NFTController {
  async createNFT(req: Request, res: Response) {
    try {
      const createNFTDto = plainToInstance(CreateNFTDto, req.body);
      const errors = await validate(createNFTDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const nft = await NFTService.createNFT(createNFTDto);
      res.status(201).json(nft);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getNFTById(req: Request, res: Response) {
    try {
      const nft = await NFTService.getNFTById(Number(req.params.id));
      if (!nft) {
        return res.status(404).json({ error: 'NFT not found' });
      }
      res.json(nft);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAvailableNFTs(req: Request, res: Response) {
    try {
      const nfts = await NFTService.getAvailableNFTs();
      res.json(nfts);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateNFTListing(req: Request, res: Response) {
    try {
      const updateDto = plainToInstance(UpdateNFTListingDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const nft = await NFTService.updateNFTListing(
        Number(req.params.id),
        updateDto,
      );
      res.json(nft);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new NFTController();
