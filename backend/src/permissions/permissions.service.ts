import { Injectable } from '@nestjs/common';
import { Permission, ROLE_PERMISSIONS } from './permission.entity';

@Injectable()
export class PermissionsService {
  getPermissionsForRole(role: string): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  hasPermission(role: string, permission: Permission): boolean {
    const perms = this.getPermissionsForRole(role);
    return perms.includes(permission);
  }

  getPermissionMatrix() {
    return ROLE_PERMISSIONS;
  }
}
