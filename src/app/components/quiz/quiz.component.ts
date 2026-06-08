import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  default: [
    {
      question: 'What does Perplexity AI combine to answer questions?',
      options: [
        'Images and video',
        'Large language models + real-time web search',
        'Social media and databases',
        'Only Wikipedia',
      ],
      correctIndex: 1,
      explanation: 'Perplexity AI merges LLMs with live web search to generate cited answers.',
    },
    {
      question: 'Which feature allows Perplexity to support team workflows?',
      options: ['Discover Feed', 'Focus Modes', 'Collaborative Spaces', 'Patent Search'],
      correctIndex: 2,
      explanation: 'Spaces is a collaborative feature built for teams to share threads and findings.',
    },
    {
      question: 'Unlike traditional search engines, Perplexity returns:',
      options: [
        'A list of 10 blue links',
        'Only images',
        'A synthesized answer with citations',
        'Only YouTube videos',
      ],
      correctIndex: 2,
      explanation: 'Perplexity synthesizes information from multiple sources into a single cited answer.',
    },
    {
      question: 'Which AI models can Perplexity use?',
      options: [
        'Only GPT-4',
        'Claude, GPT-4, and Llama',
        'Only open-source models',
        'Only Gemini',
      ],
      correctIndex: 1,
      explanation: 'Perplexity supports multiple models including Claude, GPT-4, and Llama.',
    },
  ],
  quantum: [
    {
      question: 'What is a qubit?',
      options: [
        'A quantum hard drive',
        'The quantum equivalent of a classical bit that can superpose',
        'A type of quantum software',
        'A measurement unit for quantum energy',
      ],
      correctIndex: 1,
      explanation: 'A qubit can exist in superposition — representing both 0 and 1 simultaneously.',
    },
    {
      question: "What did Google's Sycamore achieve?",
      options: [
        'Built the first quantum network',
        'Factored a 1024-bit number',
        'Completed in 200s what a supercomputer would take 10,000 years',
        'Created room-temperature superconductors',
      ],
      correctIndex: 2,
      explanation: 'Google claimed quantum supremacy with Sycamore completing a task in 200 seconds.',
    },
    {
      question: 'What property allows two qubits to be correlated regardless of distance?',
      options: ['Interference', 'Superposition', 'Entanglement', 'Coherence'],
      correctIndex: 2,
      explanation: 'Quantum entanglement correlates qubit states regardless of physical distance.',
    },
    {
      question: "What is IBM's latest achievement in quantum gate fidelity?",
      options: ['85%', '95%', '99.9%', '100%'],
      correctIndex: 2,
      explanation: "IBM's Heron r2 processor achieved over 99.9% gate fidelity.",
    },
  ],
  climate: [
    {
      question: 'How much has global temperature risen above pre-industrial levels as of 2025?',
      options: ['0.5°C', '1.0°C', '1.4°C', '2.0°C'],
      correctIndex: 2,
      explanation: 'Global average temperature is approximately 1.4°C above pre-industrial levels.',
    },
    {
      question: 'What is the current atmospheric CO₂ concentration?',
      options: ['350 ppm', '400 ppm', '424 ppm', '500 ppm'],
      correctIndex: 2,
      explanation: 'CO₂ concentration reached 424 ppm — the highest in 3 million years.',
    },
    {
      question: 'What is the Paris Agreement target for limiting global warming?',
      options: ['1.0°C', '1.5°C', '2.0°C', '2.5°C'],
      correctIndex: 1,
      explanation: 'The Paris Agreement aims to limit warming to 1.5°C above pre-industrial levels.',
    },
    {
      question: 'Which energy source is now the cheapest electricity source ever recorded?',
      options: ['Wind', 'Nuclear', 'Natural Gas', 'Solar'],
      correctIndex: 3,
      explanation: 'Solar energy has become the cheapest electricity source in history.',
    },
  ],
};

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnChanges {
  @Input() topic = 'default';
  @Input() active = false;

  protected questions = signal<QuizQuestion[]>([]);
  protected currentIndex = signal(0);
  protected selectedOption = signal<number | null>(null);
  protected answered = signal(false);
  protected score = signal(0);
  protected finished = signal(false);
  protected showExplanation = signal(false);

  protected currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  protected progress = computed(() =>
    this.questions().length ? ((this.currentIndex()) / this.questions().length) * 100 : 0
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topic'] || changes['active']) {
      this.loadQuiz();
    }
  }

  private loadQuiz(): void {
    const key = this.topic in QUIZ_BANK ? this.topic : 'default';
    const qs = [...(QUIZ_BANK[key] || QUIZ_BANK['default'])];
    this.questions.set(this.shuffle(qs));
    this.currentIndex.set(0);
    this.selectedOption.set(null);
    this.answered.set(false);
    this.score.set(0);
    this.finished.set(false);
    this.showExplanation.set(false);
  }

  protected selectOption(index: number): void {
    if (this.answered()) return;
    this.selectedOption.set(index);
    this.answered.set(true);
    if (index === this.currentQuestion().correctIndex) {
      this.score.update(s => s + 1);
    }
    setTimeout(() => this.showExplanation.set(true), 400);
  }

  protected nextQuestion(): void {
    const next = this.currentIndex() + 1;
    if (next >= this.questions().length) {
      this.finished.set(true);
    } else {
      this.currentIndex.set(next);
      this.selectedOption.set(null);
      this.answered.set(false);
      this.showExplanation.set(false);
    }
  }

  protected restart(): void {
    this.loadQuiz();
  }

  protected getOptionClass(i: number): string {
    if (!this.answered()) return '';
    const correct = this.currentQuestion().correctIndex;
    if (i === correct) return 'correct';
    if (i === this.selectedOption() && i !== correct) return 'wrong';
    return 'dimmed';
  }

  protected scoreLabel = computed(() => {
    const pct = Math.round((this.score() / this.questions().length) * 100);
    if (pct === 100) return '🏆 Perfect!';
    if (pct >= 75) return '🌟 Great job!';
    if (pct >= 50) return '👍 Good effort!';
    return '📚 Keep learning!';
  });

  private shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }
}
