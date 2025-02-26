import { Request, Response } from 'express';
import ReviewService from '../services/review.service';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const createReviewDto = plainToInstance(CreateReviewDto, req.body);

      const errors = await validate(createReviewDto);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const review = await ReviewService.createReview(createReviewDto);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getReviewById(req: Request, res: Response) {
    try {
      const review = await ReviewService.getReviewById(Number(req.params.id));
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getReviewsByReviewerId(req: Request, res: Response) {
    try {
      const review = await ReviewService.getReviewsByReviewerId(
        Number(req.params.reviewerId),
      );

      res.json(review);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getReviewsByReviewedId(req: Request, res: Response) {
    try {
      const review = await ReviewService.getReviewsByReviewedId(
        Number(req.params.reviewedId),
      );

      res.json(review);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const updateDto = plainToInstance(UpdateReviewDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const review = await ReviewService.updateReview(
        Number(req.params.id),
        updateDto,
      );
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      await ReviewService.deleteReview(
        Number(req.params.id),
        Number(req.params.reviewerId),
      );
      res.sendStatus(204);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ReviewController();
