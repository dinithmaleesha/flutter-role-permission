import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-permissions')
  getMyPermissions(@Request() req) {
    const role = req.user.role;
    const permissions = this.permissionsService.getPermissionsForRole(role);
    return { role, permissions };
  }

  @UseGuards(JwtAuthGuard)
  @Get('matrix')
  getMatrix() {
    return this.permissionsService.getPermissionMatrix();
  }
}
