import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Clear any stale token between tests
    sessionStorage.removeItem('comet_token');

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the /me call triggered in the constructor (no token → no request)
    httpMock.verify();
  });

  afterEach(() => {
    sessionStorage.removeItem('comet_token');
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null user and isLoggedIn=false', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('login()', () => {
    it('should store token in sessionStorage on success', () => {
      const mockResponse = {
        token: 'test.jwt.token',
        user: { id: '1', email: 'test@example.com', isOnboarded: true }
      };

      service.login('test@example.com', 'SecurePass123!').subscribe(res => {
        expect(res.token).toBe('test.jwt.token');
      });

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/login'));
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(sessionStorage.getItem('comet_token')).toBe('test.jwt.token');
      expect(service.currentUser()?.email).toBe('test@example.com');
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  describe('signup()', () => {
    it('should set current user and store token on successful signup', () => {
      const mockResponse = {
        token: 'signup.jwt.token',
        user: { id: '2', email: 'new@example.com', isOnboarded: false }
      };

      service.signup('new@example.com', 'SecurePass123!').subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/signup'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'new@example.com', password: 'SecurePass123!' });
      req.flush(mockResponse);

      expect(sessionStorage.getItem('comet_token')).toBe('signup.jwt.token');
      expect(service.currentUser()?.email).toBe('new@example.com');
    });
  });

  describe('logout()', () => {
    it('should clear the token and user, then navigate to /login', () => {
      sessionStorage.setItem('comet_token', 'some.token');

      service.logout();

      expect(sessionStorage.getItem('comet_token')).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('googleSignIn()', () => {
    it('should POST to /api/auth/google with idToken', () => {
      const mockResponse = {
        token: 'google.jwt.token',
        user: { id: '3', email: 'google@example.com', isOnboarded: false },
        isNew: true
      };

      service.googleSignIn('google-id-token').subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/google'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body.idToken).toBe('google-id-token');
      req.flush(mockResponse);

      expect(sessionStorage.getItem('comet_token')).toBe('google.jwt.token');
    });
  });
});
