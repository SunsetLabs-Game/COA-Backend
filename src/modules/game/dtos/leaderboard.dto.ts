import { IsNumber } from 'class-validator';

export class LeaderboardDTO {
  @IsNumber()
  userId: number;

  @IsNumber()
  score: number;
}
