import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

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

const TOKEN_KEY = 'comet_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${API_BASE_URL}/api/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(true);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    const token = sessionStorage.getItem(TOKEN_KEY);
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
    return this.http.post<{ user: User }>(`${API_BASE_URL}/api/user/onboarding`, { fullName, phoneNumber }).pipe(
      tap(res => {
        this.currentUser.set(res.user);
      })
    );
  }

  updateProfile(profileData: { fullName: string; phoneNumber: string; bio?: string; avatarUrl?: string }): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${API_BASE_URL}/api/user/profile`, profileData).pipe(
      tap(res => {
        this.currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, res.token);
    this.currentUser.set(res.user);
  }
}
