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
    try {
      console.log(`[AuthService] Validating user: ${email}`);
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log(`[AuthService] User not found: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        console.log(`[AuthService] Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const { password: _, ...result } = user;
      console.log(`[AuthService] User validated successfully: ${email}`);
      return result;
    } catch (error) {
      console.error(`[AuthService] Authentication error for ${email}:`, error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(email: string, password: string) {
    try {
      console.log(`[AuthService] Login attempt for: ${email}`);
      const user = await this.validateUser(email, password);
      const permissions = this.permissionsService.getPermissionsForRole(user.role);
      const payload = { sub: user.id, email: user.email, role: user.role };

      const token = this.jwtService.sign(payload);
      console.log(`[AuthService] Login successful for: ${email}, role: ${user.role}`);

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions,
        },
      };
    } catch (error) {
      console.error(`[AuthService] Login failed for ${email}:`, error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  };

  async getProfile(userId: number) {
    try {
      console.log(`[AuthService] Getting profile for user ID: ${userId}`);
      const user = await this.usersService.findById(userId);
      if (!user) {
        console.log(`[AuthService] User not found for ID: ${userId}`);
        throw new UnauthorizedException();
      }

      const permissions = this.permissionsService.getPermissionsForRole(user.role);
      const { password: _, ...result } = user;
      console.log(`[AuthService] Profile retrieved successfully for user: ${user.email}`);
      return { ...result, permissions };
    } catch (error) {
      console.error(`[AuthService] Failed to get profile for user ID ${userId}:`, error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to get user profile');
    }
  }
}