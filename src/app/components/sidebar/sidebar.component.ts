import { Component, inject, signal, OnInit, effect, NgZone } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { ChatApiService, ChatSession } from '../../services/chat-api.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  protected router = inject(Router);
  protected search = inject(SearchService);
  protected theme = inject(ThemeService);
  protected auth = inject(AuthService);
  protected chatApi = inject(ChatApiService);
  private ngZone = inject(NgZone);

  protected collapsed = signal(false);
  protected showProfileMenu = signal(false);
  protected pendingDeleteId = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.chatApi.loadSessions().subscribe();
      }
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.chatApi.loadSessions().subscribe();
    }
  }

  protected toggle(): void {
    this.collapsed.update(v => !v);
  }

  protected newSearch(): void {
    this.search.clear();
    this.router.navigate(['/']);
  }

  protected newChat(): void {
    this.chatApi.createSession('New Chat').subscribe({
      next: (res) => {
        this.router.navigate(['/chat', res.session.id]);
      }
    });
  }

  protected selectSession(id: string): void {
    if (this.pendingDeleteId() === id) return;
    this.router.navigate(['/chat', id]);
  }

  protected promptDelete(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.pendingDeleteId.set(id);
  }

  protected cancelDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.pendingDeleteId.set(null);
  }

  protected confirmDelete(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.pendingDeleteId.set(null);
    this.chatApi.deleteSession(id).subscribe({
      next: () => {
        if (this.router.url.includes(id)) {
          this.router.navigate(['/chat']);
        }
      },
      error: (err) => {
        console.error('Failed to delete session:', err);
      }
    });
  }

  protected getInitials(): string {
    const user = this.auth.currentUser();
    if (!user) return '?';
    const name = user.fullName || '';
    if (!name) return user.email[0].toUpperCase();
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
}
