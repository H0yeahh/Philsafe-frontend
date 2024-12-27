import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // return authService.isAuthenticated().pipe(
  //   switchMap(isAuth => {
  //     if (!isAuth) {
  //       router.navigate(['/login']);
  //       return of(false);
  //     }

  //     return authService.getUserRoles().pipe(
  //       map(roles => {
  //         const requiredRoles = route.data['roles'] as Array<string>;
  //         if (requiredRoles.some(role => roles.includes(role))) {
  //           return true;
  //         } else {
  //           router.navigate(['/access-denied']);
  //           return false;
  //         }
  //       })
  //     );
  //   })
  // );

  const router = inject(Router);

  // Assuming the role is stored in sessionStorage
  const userRole = localStorage.getItem('role'); // Or localStorage.getItem('role')

  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as Array<string>;
  if (requiredRoles.some(role => role === userRole)) {
    console.log("Stored Role", userRole);
    console.log("Required Role", requiredRoles)
    return true;
  } else {
    router.navigate(['/access-denied']);
    return false;
  }
};