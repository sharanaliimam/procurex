import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser;

  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
