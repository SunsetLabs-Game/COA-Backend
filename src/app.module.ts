/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { StarknetRouterModule } from './routers';
import { StarknetController } from './modules/blockchain/controllers/starknet.controller';
import { LeaderboardModule } from './modules/game/leaderboard.module';
import { LeaderboardController } from './modules/game/controlller/leaderboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './modules/game/entities/laderboard.entity';
import { Review } from './modules/marketplace/entities/review.entity';
import { ReviewModule } from './modules/marketplace/review.module';

/**
 * Main application module
 *
 * Database Configuration (Commented for future use):
 * Uncomment the TypeOrmModule.forRoot() section when:
 * 1. You need to connect to a PostgreSQL database
 * 2. You're moving to production
 *
 * For local testing without database:
 * - Keep TypeOrmModule commented out
 * - Use in-memory storage in services
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //Database configuration - Uncomment when database connection is needed
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5433,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '12345',
      database: process.env.DB_NAME || 'coa_database',
      //entities: [__dirname + '//*.entity{.ts,.js}'], // 🟢 Busca todas las entidades
      entities: [Leaderboard, Review],
      synchronize: process.env.NODE_ENV !== 'production', // 🚨 Solo usar en desarrollo
      logging: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    BlockchainModule,
    StarknetRouterModule,
    LeaderboardModule,
    ReviewModule,
    // WalletModule,
  ],
  controllers: [StarknetController, LeaderboardController],
})
export class AppModule {}
