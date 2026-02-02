// permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const PermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the permission string we defined in the routes above
  const requiredPermission = route.data['permission'] as string;

  // If the route doesn't require a specific permission, let them through
  if (!requiredPermission) return true;

  // Check if user has this permission using your logic
  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  // Redirect if they don't have access
  alert('Access Denied: You do not have permission to view this page.');
  return router.parseUrl('/home'); 
};