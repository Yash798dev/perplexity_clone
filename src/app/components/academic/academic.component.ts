import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-academic',
  standalone: true,
  template: `
  <div class="gen-page">
    <div class="page-header">
      <h2>Academic</h2>
      <div class="tab-row">
        <button class="ptab active">Recent Papers</button>
        <button class="ptab">Most Cited</button>
        <button class="ptab">AI &amp; ML</button>
        <button class="ptab">Medicine</button>
      </div>
    </div>
    <div class="gen-layout">
      <div class="gen-main">
        @for (p of papers; track p.title) {
          <div class="paper-card" (click)="openPaper(p)" style="cursor: pointer;">
            <div class="paper-venue">{{ p.venue }} · {{ p.year }}</div>
            <div class="paper-title">{{ p.title }}</div>
            <div class="paper-authors">{{ p.authors }}</div>
            <div class="paper-abstract">{{ p.abstract }}</div>
            <div class="paper-footer">
              <span class="paper-citations">{{ p.citations }} citations</span>
              <button class="paper-btn" (click)="$event.stopPropagation(); openPaper(p)">Read Paper</button>
            </div>
          </div>
        }
      </div>
      <aside class="gen-sidebar">
        <div class="widget"><div class="widget-title">Journals</div>
          @for (j of journals; track j) { <div class="topic-chip">{{ j }}</div> }
        </div>
      </aside>
    </div>
  </div>

  <!-- Dynamic Detail Modal -->
  @if (activePaper()) {
    <div class="modal-overlay" (click)="closePaper()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="closePaper()">✕</button>
        <div class="modal-body">
          <span class="modal-topic">{{ activePaper()?.venue }} · {{ activePaper()?.year }}</span>
          <h2 class="modal-title">{{ activePaper()?.title }}</h2>
          <div class="modal-authors-list"><strong>Authors:</strong> {{ activePaper()?.authors }}</div>
          <div class="modal-meta">
            <span>{{ activePaper()?.citations }} citations</span>
          </div>
          <hr class="modal-divider">
          <h4 class="modal-abstract-header">Abstract</h4>
          <p class="modal-content">{{ activePaper()?.abstract }}</p>
        </div>
      </div>
    </div>
  }
  `,
  styleUrl: './academic.component.scss'
})
export class AcademicComponent {
  protected activePaper = signal<any | null>(null);

  papers = [
    { title:'Attention Is All You Need', authors:'Vaswani, Shazeer, Parmar et al.', venue:'NeurIPS', year:2017, citations:92847, abstract:'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.' },
    { title:'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding', authors:'Devlin, Chang, Lee, Toutanova', venue:'NAACL', year:2019, citations:68420, abstract:'We introduce BERT, a novel language representation model which stands for Bidirectional Encoder Representations from Transformers.' },
    { title:'GPT-4 Technical Report', authors:'OpenAI', venue:'arXiv', year:2023, citations:12840, abstract:'We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs.' },
    { title:'Scaling Laws for Neural Language Models', authors:'Kaplan, McCandlish, Henighan et al.', venue:'arXiv', year:2020, citations:4820, abstract:'We study empirical scaling laws for language model performance on the cross-entropy loss as a function of model size, dataset size, and compute.' },
  ];
  journals = ['Nature','Science','Cell','PNAS','NEJM','Lancet','JAMA','PLOS ONE','arXiv','IEEE'];

  protected openPaper(paper: any): void {
    this.activePaper.set(paper);
  }

  protected closePaper(): void {
    this.activePaper.set(null);
  }
}
