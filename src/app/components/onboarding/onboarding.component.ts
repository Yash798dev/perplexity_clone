import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected fullName = signal('');
  protected phoneNumber = signal('');
  protected errorMessage = signal('');
  protected isSubmitting = signal(false);

  protected onSubmit(): void {
    if (!this.fullName().trim() || !this.phoneNumber().trim()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    this.auth.completeOnboarding(this.fullName().trim(), this.phoneNumber().trim()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to complete onboarding. Please try again.');
      }
    });
  }
}
