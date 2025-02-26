import { Repository } from 'typeorm';
// import { AppDataSource } from '../../../data-source';
import { Review } from '../entities/review.entity';

export const ReviewRepository: Repository<Review> = AppDataSource.getRepository(Review);
