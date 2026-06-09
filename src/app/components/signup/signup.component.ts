import { Component, inject, signal, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements AfterViewInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected email = signal('');
  protected password = signal('');
  protected confirmPassword = signal('');
  protected errorMessage = signal('');
  protected isSubmitting = signal(false);

  ngAfterViewInit(): void {
    this.initGoogleSignInButton();
  }

  private initGoogleSignInButton(): void {
    const googleObj = (window as any).google;
    if (googleObj && googleObj.accounts && googleObj.accounts.id) {
      googleObj.accounts.id.initialize({
        client_id: '743853223633-kjgpu01ov24t09c3cln8p4om552vp7ik.apps.googleusercontent.com',
        callback: (response: any) => {
          if (response.credential) {
            this.isSubmitting.set(true);
            this.auth.googleSignIn(response.credential).subscribe({
              next: (res) => {
                this.isSubmitting.set(false);
                if (!res.user.isOnboarded) {
                  this.router.navigate(['/onboarding']);
                } else {
                  this.router.navigate(['/']);
                }
              },
              error: (err) => {
                this.isSubmitting.set(false);
                this.errorMessage.set(err.error?.error || 'Google Sign-In verification failed on the server.');
              }
            });
          }
        }
      });

      // Render the official Google Sign-In button in the placeholder container
      googleObj.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', width: 320 }
      );
    } else {
      // Retry after a small delay if SDK hasn't finished loading
      setTimeout(() => this.initGoogleSignInButton(), 250);
    }
  }

  protected onSubmit(): void {
    if (!this.email().trim() || !this.password() || !this.confirmPassword()) {
      this.errorMessage.set('Please fill out all fields.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (this.password().length < 6) {
      this.errorMessage.set('Password must be at least 6 characters long.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.auth.signup(this.email().trim(), this.password()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/onboarding']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to sign up. Please try again.');
      }
    });
  }
}
