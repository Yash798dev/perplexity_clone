import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('./components/search-results/search-results.component').then(m => m.SearchResultsComponent) },
  { path: 'discover', loadComponent: () => import('./components/discover/discover.component').then(m => m.DiscoverComponent) },
  { path: 'finance', loadComponent: () => import('./components/finance/finance.component').then(m => m.FinanceComponent) },
  { path: 'health', loadComponent: () => import('./components/health/health.component').then(m => m.HealthComponent) },
  { path: 'academic', loadComponent: () => import('./components/academic/academic.component').then(m => m.AcademicComponent) },
  { path: 'patents', loadComponent: () => import('./components/patents/patents.component').then(m => m.PatentsComponent) },
  { path: 'spaces', loadComponent: () => import('./components/spaces/spaces.component').then(m => m.SpacesComponent) },
  { path: 'artifacts', loadComponent: () => import('./components/artifacts/artifacts.component').then(m => m.ArtifactsComponent) },
  { path: 'history', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent) },
  { path: '**', redirectTo: '' }
];
