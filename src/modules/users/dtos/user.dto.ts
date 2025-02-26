export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  balance?: number;
}
