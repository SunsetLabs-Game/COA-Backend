import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from '@/modules/users/services/user.service';
import { CreateUserDto, UpdateUserDto } from '@/modules/users/dtos/user.dto';
import { User } from '@/modules/users/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }): Promise<User> {
    return this.userService.authenticateUser(dto.email, dto.password);
  }
}
