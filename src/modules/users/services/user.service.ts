import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '@/modules/users/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/entities/user.entity';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    // Validate email format
    const user = new User();
    Object.assign(user, dto);
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check for existing user
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.findByEmail(dto.email),
      this.userRepository.findByUsername(dto.username),
    ]);

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    if (usernameExists) {
      throw new ConflictException('Username already exists');
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    try {
      const userData = {
        ...dto,
        password: hashedPassword,
        balance: 0,
        isEmailVerified: false,
      };
      return await this.userRepository.create(userData);
    } catch (error) {
      throw new BadRequestException('Could not create user');
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    if (dto.username && dto.username !== user.username) {
      const usernameExists = await this.userRepository.findByUsername(
        dto.username,
      );
      if (usernameExists) {
        throw new ConflictException('Username already exists');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    try {
      Object.assign(user, dto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Could not update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.delete(user.id);
  }

  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
