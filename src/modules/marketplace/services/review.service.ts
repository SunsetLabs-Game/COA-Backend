import { Review } from '../entities/review.entity';
import { ReviewRepository } from '../repositories/review.repository';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';

class ReviewService {
  async createReview(dto: CreateReviewDto): Promise<Review> {
    const review = ReviewRepository.create({
      rating: dto.rating,
      comment: dto.comment ?? null,
      reviewedId: dto.reviewedId,
      reviewerId: dto.reviewerId,
    });
    return ReviewRepository.save(review);
  }

  async getReviewById(id: number): Promise<Review | null> {
    return ReviewRepository.findOne({ where: { id } });
  }

  async getReviewsByReviewerId(reviewerId: number): Promise<Review[]> {
    return ReviewRepository.find({
      where: { reviewerId },
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsByReviewedId(reviewedId: number): Promise<Review[]> {
    return ReviewRepository.find({
      where: { reviewedId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateReview(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await ReviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new Error('Review not found');
    }

    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }

    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }
    return ReviewRepository.save(review);
  }

  async deleteReview(id: number, reviewerId: number): Promise<boolean> {
    const review = await ReviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new Error('Review not found');
    }

    if (review.reviewerId !== reviewerId) {
      throw new Error('You are not allowed to delete this review');
    }

    await ReviewRepository.remove(review);
    return true;
  }
}

export default new ReviewService();
