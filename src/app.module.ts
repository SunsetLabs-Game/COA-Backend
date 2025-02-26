import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { StarknetRouterModule } from './routers';
import { StarknetController } from './modules/blockchain/controllers/starknet.controller';
import { LaderboardModule } from './modules/game/laderboard.module';

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
    // Database configuration - Uncomment when database connection is needed
    // TypeOrmModule.forRoot({
    //   // Production configuration
    //   type: 'postgres',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: parseInt(process.env.DB_PORT) || 5432,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: process.env.NODE_ENV !== 'production', // Set to false in production
    //   logging: process.env.NODE_ENV !== 'production',     // Set to false in production
    //   ssl: process.env.DB_SSL === 'true',                // Enable SSL in production
    // }),
    UserModule,
    BlockchainModule,
    StarknetRouterModule,
    LaderboardModule,
  ],
  controllers: [StarknetController],
})
export class AppModule {}
