import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({ selector:'app-history', standalone:true, imports:[DatePipe], template:`
<div class="gen-page">
  <div class="page-header">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <h2>History</h2>
      @if (svc.history().length > 0) {
        <button class="clear-all-btn" (click)="clearAll()">Clear All</button>
      }
    </div>
  </div>
  <div style="padding:24px;max-width:800px;margin:0 auto">
    @if (svc.history().length === 0) {
      <div class="history-empty">
        <div style="font-size:40px;margin-bottom:12px">🕐</div>
        <div style="font-size:16px;font-weight:500;margin-bottom:6px">No search history yet</div>
        <div style="font-size:14px;color:var(--text-3)">Your searches will appear here</div>
      </div>
    } @else {
      <div class="history-list">
        @for (h of svc.history(); track h.id) {
          <div class="history-row" (click)="rerun(h.query)" [id]="'history-' + h.id">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <div class="history-query">{{ h.query }}</div>
            <div class="history-time">{{ h.ts | date:'h:mm a' }}</div>
          </div>
        }
      </div>
    }
  </div>
</div>`, styleUrl:'./history.component.scss' })
export class HistoryComponent {
  protected svc = inject(SearchService);
  private router = inject(Router);

  rerun(q: string): void {
    this.svc.search(q);
    this.router.navigate(['/search']);
  }

  clearAll(): void { this.svc.history.set([]); }
}
