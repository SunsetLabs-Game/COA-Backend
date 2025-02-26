
import { Repository } from 'typeorm';
//import { AppDataSource } from '../../../../data-source';
import { getRepository, Repository } from 'typeorm';
import { NFT } from '../entities/nft.entity';

export class NFTRepository {
  private repo: Repository<NFT>;

  constructor() {
    this.repo = getRepository(NFT);
  }

  async create(nftData: Partial<NFT>): Promise<NFT> {
    const nft = this.repo.create(nftData);
    return await this.repo.save(nft);
  }

  async findAll(): Promise<NFT[]> {
    return await this.repo.find();
  }

  async findById(id: number): Promise<NFT | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, nftData: Partial<NFT>): Promise<NFT | null> {
    await this.repo.update(id, nftData);
    return await this.repo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findByOwner(ownerId: number): Promise<NFT[]> {
    return await this.repo.find({ where: { ownerId } });
  }

  async findListedNFTs(): Promise<NFT[]> {
    return await this.repo.find({ where: { isListed: true } });
  }
}
