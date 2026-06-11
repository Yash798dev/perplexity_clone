import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  favicon: string;
  snippet: string;
}

export interface AiAnswer {
  content: string;
  isStreaming: boolean;
  sources: SearchResult[];
  relatedQuestions: string[];
}

// Curated topic-based sources shown alongside the AI answer
const TOPIC_SOURCES: Record<string, SearchResult[]> = {
  default: [
    { id: '1', title: 'What is Perplexity AI? How does it work?', url: 'https://www.perplexity.ai/hub/blog/what-is-perplexity-ai', domain: 'perplexity.ai', favicon: 'P', snippet: 'Perplexity AI is a conversational search engine that uses large language models to answer questions in real-time.' },
    { id: '2', title: 'Perplexity AI - Wikipedia', url: 'https://en.wikipedia.org/wiki/Perplexity_AI', domain: 'en.wikipedia.org', favicon: 'W', snippet: 'Perplexity AI is an AI-powered search engine and chatbot launched in 2022.' },
    { id: '3', title: 'How Perplexity AI is changing the way we search', url: 'https://www.theverge.com/ai-perplexity', domain: 'theverge.com', favicon: 'V', snippet: 'The AI startup is trying to replace Google by giving users direct answers instead of a list of links.' },
  ],
  quantum: [
    { id: '4', title: 'What is Quantum Computing? | IBM', url: 'https://www.ibm.com/topics/quantum-computing', domain: 'ibm.com', favicon: 'I', snippet: 'Quantum computing harnesses quantum mechanical phenomena like superposition and entanglement.' },
    { id: '5', title: 'Quantum Computing - Nature', url: 'https://www.nature.com/subjects/quantum-computing', domain: 'nature.com', favicon: 'N', snippet: 'Latest research in quantum computing including breakthroughs in error correction.' },
    { id: '6', title: 'Google Achieves Quantum Supremacy', url: 'https://ai.google/research/quantum', domain: 'ai.google', favicon: 'G', snippet: 'Google\'s Sycamore processor completed a computation in 200 seconds that would take classical computers 10,000 years.' },
  ],
  climate: [
    { id: '7', title: 'Climate Change: Vital Signs of the Planet', url: 'https://climate.nasa.gov', domain: 'climate.nasa.gov', favicon: 'N', snippet: 'NASA\'s key indicators of Earth\'s changing climate including temperature, sea level, and Arctic ice.' },
    { id: '8', title: 'IPCC Sixth Assessment Report', url: 'https://www.ipcc.ch/report/ar6', domain: 'ipcc.ch', favicon: 'I', snippet: 'The IPCC\'s latest report on climate change causes, impacts, and solutions.' },
  ],
  ai: [
    { id: '9', title: 'Artificial Intelligence | Stanford Encyclopedia', url: 'https://plato.stanford.edu/entries/artificial-intelligence/', domain: 'plato.stanford.edu', favicon: 'S', snippet: 'A comprehensive overview of AI concepts, history, and philosophical implications.' },
    { id: '10', title: 'What is AI? | IBM', url: 'https://www.ibm.com/topics/artificial-intelligence', domain: 'ibm.com', favicon: 'I', snippet: 'IBM\'s guide to artificial intelligence — concepts, applications, and industry use cases.' },
  ],
};

const RELATED_QUESTIONS: Record<string, string[]> = {
  default: ['How does Perplexity AI compare to ChatGPT?', 'Is Perplexity AI free to use?', 'What models does Perplexity use?', 'How accurate is Perplexity AI?'],
  quantum: ['What are the applications of quantum computing?', 'How many qubits does IBM\'s latest processor have?', 'When will quantum computers be commercially available?', 'What is quantum entanglement?'],
  climate: ['What is the Paris Agreement?', 'How does solar energy reduce carbon emissions?', 'What are the effects of rising sea levels?', 'Which countries have reached net zero?'],
  ai: ['What is machine learning?', 'How does deep learning work?', 'What is a neural network?', 'What is GPT?'],
};

interface SearchApiResponse {
  query: string;
  answer: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  private searchUrl = `${API_BASE_URL}/api/search`;

  readonly query = signal('');
  readonly results = signal<SearchResult[]>([]);
  readonly answer = signal<AiAnswer | null>(null);
  readonly isLoading = signal(false);
  readonly history = signal<{ id: string; query: string; ts: Date }[]>([]);
  readonly topicKey = signal('default');

  readonly hasResults = computed(() => this.results().length > 0);

  search(q: string): void {
    if (!q.trim()) return;
    this.query.set(q);
    this.isLoading.set(true);
    this.results.set([]);
    this.answer.set(null);

    const key = this.getKey(q);
    this.topicKey.set(key);

    this.http.get<SearchApiResponse>(`${this.searchUrl}?q=${encodeURIComponent(q)}`).pipe(
      catchError(() => {
        // Fallback: return a generic response if backend unreachable
        return of({ query: q, answer: `Searching for "${q}"... The knowledge base is currently unavailable. Please try again later.`, timestamp: new Date().toISOString() });
      })
    ).subscribe(apiResponse => {
      const sources = TOPIC_SOURCES[key] ?? TOPIC_SOURCES['default'];
      const related = RELATED_QUESTIONS[key] ?? RELATED_QUESTIONS['default'];

      this.results.set(sources);
      this.isLoading.set(false);
      this.streamAnswer(apiResponse.answer, sources, related);
      this.history.update(h => [{ id: `h${Date.now()}`, query: q, ts: new Date() }, ...h].slice(0, 20));
    });
  }

  private streamAnswer(fullText: string, sources: SearchResult[], relatedQuestions: string[]): void {
    this.answer.set({ content: '', isStreaming: true, sources, relatedQuestions });

    let i = 0;
    const iv = setInterval(() => {
      i += 4;
      this.answer.update(a => a ? { ...a, content: fullText.slice(0, i), isStreaming: i < fullText.length } : a);
      if (i >= fullText.length) clearInterval(iv);
    }, 15);
  }

  clear(): void {
    this.query.set('');
    this.results.set([]);
    this.answer.set(null);
  }

  private getKey(q: string): string {
    const lq = q.toLowerCase();
    if (lq.includes('quantum')) return 'quantum';
    if (lq.includes('climate') || lq.includes('carbon') || lq.includes('warming')) return 'climate';
    if (lq.includes('artificial intelligence') || lq.includes(' ai ') || lq.startsWith('ai ') || lq.endsWith(' ai') || lq === 'ai') return 'ai';
    return 'default';
  }
}
