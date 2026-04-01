import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async onModuleInit() {
    this.users = [
      {
        id: 1,
        email: 'admin@test.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Admin User',
        role: 'admin',
      },
      {
        id: 2,
        email: 'manager@test.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Manager User',
        role: 'manager',
      },
      {
        id: 3,
        email: 'user@test.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Regular User',
        role: 'user',
      },
    ];
  }

    async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}