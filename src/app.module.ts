/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { StarknetRouterModule } from './routers';
import { LeaderboardModule } from './modules/game/leaderboard.module';
import { LeaderboardController } from './modules/game/controlller/leaderboard.controller';
// import { Leaderboard } from './modules/game/entities/laderboard.entity';
import { InventoryModule } from './modules/users/inventory.module';
import { Leaderboard } from './modules/game/entities/laderboard.entity';
import { Review } from './modules/marketplace/entities/review.entity';
import { ReviewModule } from './modules/marketplace/review.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StarknetModule } from './modules/blockchain/starknet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5433,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '12345',
      database: process.env.DB_NAME || 'coa_database',
      entities: [Leaderboard, Review], // 🟢 Busca solo las entidades necesarias
      synchronize: process.env.NODE_ENV !== 'production', // 🚨 Solo usar en desarrollo
      logging: process.env.NODE_ENV !== 'production',
    }),

    UserModule,

    MarketplaceModule,
    StarknetRouterModule,
    LeaderboardModule,
    ReviewModule,
    StarknetModule,
  ],
  controllers: [LeaderboardController],
})
export class AppModule {}
