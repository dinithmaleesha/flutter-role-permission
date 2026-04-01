export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'view_reports'
  | 'edit_content'
  | 'delete_content'
  | 'view_analytics';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_users',
    'view_reports',
    'edit_content',
    'delete_content',
    'view_analytics',
  ],
  manager: [
    'view_dashboard',
    'view_reports',
    'edit_content',
    'view_analytics',
  ],
  user: ['view_dashboard', 'view_reports'],
};
