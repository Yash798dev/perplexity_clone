import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const checkOnboarding = () => {
    const user = auth.currentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    if (user.isOnboarded) {
      return true;
    }
    router.navigate(['/onboarding']);
    return false;
  };

  if (!auth.isLoading()) {
    return checkOnboarding();
  }

  return toObservable(auth.isLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => checkOnboarding())
  );
};
