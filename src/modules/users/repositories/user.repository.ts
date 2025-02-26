import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@/modules/users/entities/user.entity';

/**
 * User Repository
 *
 * Current Implementation:
 * - Uses in-memory storage for testing purposes
 * - Simulates database operations
 *
 * For Production:
 * 1. Uncomment TypeORM imports and decorators
 * 2. Replace in-memory operations with actual database calls
 * 3. Remove the users array and its operations
 */
@Injectable()
export class UserRepository {
  // In-memory storage for testing
  private users: User[] = [];
  private currentId = 1;

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = new User();
      Object.assign(user, {
        ...userData,
        id: this.currentId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.users.push(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return this.users.find((user) => user.id === id) || null;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return (
        this.users.find(
          (user) => user.email.toLowerCase() === email.toLowerCase(),
        ) || null
      );
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return this.users.find((user) => user.username === username) || null;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by username');
    }
  }

  async save(user: User): Promise<User> {
    try {
      const index = this.users.findIndex((u) => u.id === user.id);
      if (index >= 0) {
        user.updatedAt = new Date();
        this.users[index] = user;
        return user;
      }
      throw new Error('User not found');
    } catch (error) {
      throw new InternalServerErrorException('Error saving user');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const index = this.users.findIndex((user) => user.id === id);
      if (index >= 0) {
        this.users.splice(index, 1);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
