import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { MindmapComponent } from '../mindmap/mindmap.component';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [FormsModule, MindmapComponent, QuizComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  protected svc = inject(SearchService);
  private router = inject(Router);

  protected followupQuery = signal('');
  protected copiedAnswer = signal(false);
  protected showMindMap = signal(false);
  protected showQuiz = signal(false);

  protected currentTopic = computed(() => this.svc.topicKey());

  ngOnInit(): void {
    if (!this.svc.query()) this.router.navigate(['/']);
  }

  protected formatAnswer(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.+)$/gm, '<h3 class="ans-h2">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 class="ans-h3">$1</h4>')
      .replace(/^> (.+)$/gm, '<blockquote class="ans-quote">$1</blockquote>')
      .replace(/^\d+\. (.+)$/gm, '<div class="ans-li">$1</div>')
      .replace(/^- (.+)$/gm, '<div class="ans-li bullet">$1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  protected toggleMindMap(): void {
    this.showMindMap.update(v => !v);
    if (this.showMindMap()) this.showQuiz.set(false);
  }

  protected toggleQuiz(): void {
    this.showQuiz.update(v => !v);
    if (this.showQuiz()) this.showMindMap.set(false);
  }

  protected followUp(): void {
    const q = this.followupQuery().trim();
    if (!q) return;
    this.showMindMap.set(false);
    this.showQuiz.set(false);
    this.svc.search(q);
    this.followupQuery.set('');
  }

  protected copyAnswer(): void {
    if (this.svc.answer()) {
      navigator.clipboard.writeText(this.svc.answer()!.content).then(() => {
        this.copiedAnswer.set(true);
        setTimeout(() => this.copiedAnswer.set(false), 2000);
      });
    }
  }

  protected searchRelated(q: string): void {
    this.showMindMap.set(false);
    this.showQuiz.set(false);
    this.svc.search(q);
  }
}
