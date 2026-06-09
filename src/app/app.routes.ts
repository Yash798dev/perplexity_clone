import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { onboardingGuard } from './guards/onboarding.guard';

export const routes: Routes = [
  // Auth pages (unauthenticated)
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },
  
  // Onboarding (requires authentication, but not yet onboarded)
  { path: 'onboarding', loadComponent: () => import('./components/onboarding/onboarding.component').then(m => m.OnboardingComponent), canActivate: [authGuard] },

  // Protected application routes
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'search', loadComponent: () => import('./components/search-results/search-results.component').then(m => m.SearchResultsComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'discover', loadComponent: () => import('./components/discover/discover.component').then(m => m.DiscoverComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'finance', loadComponent: () => import('./components/finance/finance.component').then(m => m.FinanceComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'health', loadComponent: () => import('./components/health/health.component').then(m => m.HealthComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'academic', loadComponent: () => import('./components/academic/academic.component').then(m => m.AcademicComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'patents', loadComponent: () => import('./components/patents/patents.component').then(m => m.PatentsComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'spaces', loadComponent: () => import('./components/spaces/spaces.component').then(m => m.SpacesComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'artifacts', loadComponent: () => import('./components/artifacts/artifacts.component').then(m => m.ArtifactsComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'history', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent), canActivate: [authGuard, onboardingGuard] },
  
  // Chat features
  { path: 'chat', loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent), canActivate: [authGuard, onboardingGuard] },
  { path: 'chat/:id', loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent), canActivate: [authGuard, onboardingGuard] },

  // Profile Settings
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard, onboardingGuard] },

  { path: '**', redirectTo: '' }
];
