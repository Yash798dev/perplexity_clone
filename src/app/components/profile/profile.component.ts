import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  protected auth = inject(AuthService);

  protected fullName = signal('');
  protected phoneNumber = signal('');
  protected bio = signal('');
  protected successMessage = signal('');
  protected errorMessage = signal('');
  protected isSaving = signal(false);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.fullName.set(user.fullName || '');
      this.phoneNumber.set(user.phoneNumber || '');
      this.bio.set(user.bio || '');
    }
  }

  protected getInitials(): string {
    const name = this.fullName().trim();
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  protected onSave(): void {
    if (!this.fullName().trim() || !this.phoneNumber().trim()) {
      this.errorMessage.set('Full Name and Phone Number are required.');
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSaving.set(true);

    const payload = {
      fullName: this.fullName().trim(),
      phoneNumber: this.phoneNumber().trim(),
      bio: this.bio().trim(),
    };

    this.auth.updateProfile(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Profile updated successfully!');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.error || 'Failed to update profile.');
      }
    });
  }
}
