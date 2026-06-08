import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private router = inject(Router);
  protected search = inject(SearchService);
  protected collapsed = signal(false);

  protected toggle(): void { this.collapsed.update(v => !v); }

  protected newSearch(): void {
    this.search.clear();
    this.router.navigate(['/']);
  }
}
