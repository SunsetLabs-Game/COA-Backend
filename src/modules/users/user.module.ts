import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';

/**
 * User Module Configuration
 *
 * Database Integration (Commented for future use):
 * When connecting to database, uncomment:
 * 1. TypeOrmModule import
 * 2. TypeOrmModule.forFeature([User]) in imports array
 *
 * For local testing:
 * - Using in-memory storage implementation
 * - No database connection required
 */
@Module({
  // imports: [TypeOrmModule.forFeature([User])], // Uncomment when database is needed
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
