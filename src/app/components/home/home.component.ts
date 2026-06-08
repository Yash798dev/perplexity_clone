import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

const SUGGESTIONS = [
  'world quantum day','walmart','walgreens','wells fargo','wayfair',
  'washington dc','what is perplexity','what time is it','weather today',
  'who is elon musk','wikipedia','world news','who won the election',
  'weight loss tips','what is AI'
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  protected search = inject(SearchService);
  private router = inject(Router);

  protected query = signal('');
  protected isFocused = signal(false);
  protected suggestions = signal<string[]>([]);
  protected selectedIdx = signal(-1);
  protected showModelMenu = signal(false);
  protected selectedModel = signal('Default');
  protected models = ['Default', 'Claude 3.5 Sonnet', 'GPT-4o', 'Llama 3.1 70B', 'Gemini 1.5 Pro'];

  protected onInput(val: string): void {
    this.query.set(val);
    this.selectedIdx.set(-1);
    if (val.length >= 1) {
      const filtered = SUGGESTIONS.filter(s => s.toLowerCase().startsWith(val.toLowerCase())).slice(0, 6);
      this.suggestions.set(filtered);
    } else {
      this.suggestions.set([]);
    }
  }

  protected onKey(e: KeyboardEvent): void {
    const suggs = this.suggestions();
    if (e.key === 'ArrowDown') { e.preventDefault(); this.selectedIdx.update(i => Math.min(i+1, suggs.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.selectedIdx.update(i => Math.max(i-1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); this.submit(); }
    else if (e.key === 'Escape') { this.suggestions.set([]); }
  }

  protected focus(): void { this.isFocused.set(true); }
  protected blur(): void { setTimeout(() => { this.isFocused.set(false); this.suggestions.set([]); }, 150); }

  protected pickSuggestion(s: string): void {
    this.query.set(s);
    this.suggestions.set([]);
    this.submit();
  }

  protected submit(): void {
    const idx = this.selectedIdx();
    const q = idx >= 0 ? this.suggestions()[idx] : this.query();
    if (!q.trim()) return;
    this.query.set(q);
    this.suggestions.set([]);
    this.search.search(q);
    this.router.navigate(['/search']);
  }

  protected goSearch(): void { this.submit(); }
  protected selectModel(m: string): void { this.selectedModel.set(m); this.showModelMenu.set(false); }
}
