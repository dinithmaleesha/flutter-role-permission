import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PermissionsService } from "src/permissions/permissions.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/user.entity";
import * as bcrypt from 'bcrypt';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionsService: PermissionsService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const permissions = this.permissionsService.getPermissionsForRole(user.role);
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_tolen: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions,
      },
    }
  };

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    const permissions = this.permissionsService.getPermissionsForRole(user.role);
    const { password: _, ...result } = user;
    return { ...result, permissions };
  }
}