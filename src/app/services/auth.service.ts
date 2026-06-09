import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  isOnboarded: boolean;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';

  // Signals
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(true);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    const token = localStorage.getItem('comet_token');
    if (!token) {
      this.isLoading.set(false);
      return;
    }

    this.http.get<{ user: User }>(`${this.apiUrl}/me`).subscribe({
      next: (res) => {
        this.currentUser.set(res.user);
        this.isLoading.set(false);
      },
      error: () => {
        this.logout();
        this.isLoading.set(false);
      }
    });
  }

  signup(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, { email, password }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  googleSignIn(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, { idToken }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  completeOnboarding(fullName: string, phoneNumber: string): Observable<{ user: User }> {
    return this.http.post<{ user: User }>('http://localhost:3000/api/user/onboarding', { fullName, phoneNumber }).pipe(
      tap(res => {
        this.currentUser.set(res.user);
      })
    );
  }

  updateProfile(profileData: { fullName: string; phoneNumber: string; bio?: string; avatarUrl?: string }): Observable<{ user: User }> {
    return this.http.put<{ user: User }>('http://localhost:3000/api/user/profile', profileData).pipe(
      tap(res => {
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('comet_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem('comet_token', res.token);
    this.currentUser.set(res.user);
  }
}
