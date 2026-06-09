import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If already loaded, handle immediately
  if (!auth.isLoading()) {
    if (auth.isLoggedIn()) return true;
    router.navigate(['/login']);
    return false;
  }

  // Otherwise, wait for loading to finish
  return toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => {
      if (auth.isLoggedIn()) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
